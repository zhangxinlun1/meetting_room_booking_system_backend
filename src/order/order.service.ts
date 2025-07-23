import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const order = this.orderRepository.create(createOrderDto);
    const savedOrder = await this.orderRepository.save(order);
    
    // 保存订单项
    if (createOrderDto.items && createOrderDto.items.length > 0) {
      const orderItems = createOrderDto.items.map(item => ({
        ...item,
        orderId: savedOrder.id,
        subtotal: item.price * item.quantity, // 计算小计
      }));
      await this.orderItemRepository.save(orderItems);
    }
    
    return savedOrder;
  }

  findAll(query: any) {
    const { page = 1, limit = 10, status, startDate, endDate } = query;
    const skip = (page - 1) * limit;
    
    let whereCondition: any = {};
    
    if (status) {
      whereCondition.status = status;
    }
    
    if (startDate && endDate) {
      whereCondition.createTime = Between(new Date(startDate), new Date(endDate));
    }

    return this.orderRepository.find({
      where: whereCondition,
      skip,
      take: limit,
      order: { createTime: 'DESC' },
      relations: ['items'],
    });
  }

  findOne(id: number) {
    return this.orderRepository.findOne({ 
      where: { id },
      relations: ['items'],
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.orderRepository.update(id, updateOrderDto);
  }

  remove(id: number) {
    return this.orderRepository.delete(id);
  }

  async getDailyStatistics() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const orders = await this.orderRepository.find({
      where: {
        createTime: Between(startOfDay, endOfDay),
        status: 'completed',
      },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const totalProfit = orders.reduce((sum, order) => sum + Number(order.profit), 0);

    return {
      date: today.toISOString().split('T')[0],
      orderCount: orders.length,
      totalRevenue,
      totalProfit,
    };
  }

  async getMonthlyStatistics() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

    const orders = await this.orderRepository.find({
      where: {
        createTime: Between(startOfMonth, endOfMonth),
        status: 'completed',
      },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const totalProfit = orders.reduce((sum, order) => sum + Number(order.profit), 0);

    return {
      month: today.getMonth() + 1,
      year: today.getFullYear(),
      orderCount: orders.length,
      totalRevenue,
      totalProfit,
    };
  }
} 