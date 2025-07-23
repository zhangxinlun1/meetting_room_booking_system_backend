import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { StockIn } from './entities/stock-in.entity';
import { StockInItem } from './entities/stock-in-item.entity';
import { StockAdjustment } from './entities/stock-adjustment.entity';
import { Product } from '../product/entities/product.entity';
import { CreateStockInDto } from './dto/create-stock-in.dto';
import { CreateStockAdjustmentDto } from './dto/create-stock-adjustment.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockIn)
    private stockInRepository: Repository<StockIn>,
    @InjectRepository(StockInItem)
    private stockInItemRepository: Repository<StockInItem>,
    @InjectRepository(StockAdjustment)
    private stockAdjustmentRepository: Repository<StockAdjustment>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createStockIn(createStockInDto: CreateStockInDto) {
    const stockIn = this.stockInRepository.create(createStockInDto);
    const savedStockIn = await this.stockInRepository.save(stockIn);
    
    // 保存入库项
    if (createStockInDto.items && createStockInDto.items.length > 0) {
      const stockInItems = createStockInDto.items.map(item => ({
        ...item,
        stockInId: savedStockIn.id,
      }));
      await this.stockInItemRepository.save(stockInItems);
      
      // 更新商品库存
      for (const item of createStockInDto.items) {
        await this.updateProductStock(item.productId, item.quantity, 'increase');
      }
    }
    
    return savedStockIn;
  }

  findAllStockIn(query: any) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    return this.stockInRepository.find({
      skip,
      take: limit,
      order: { createTime: 'DESC' },
      relations: ['items'],
    });
  }

  findOneStockIn(id: number) {
    return this.stockInRepository.findOne({ 
      where: { id },
      relations: ['items'],
    });
  }

  async createStockAdjustment(createStockAdjustmentDto: CreateStockAdjustmentDto) {
    const stockAdjustment = this.stockAdjustmentRepository.create(createStockAdjustmentDto);
    const savedAdjustment = await this.stockAdjustmentRepository.save(stockAdjustment);
    
    // 更新商品库存
    const quantity = createStockAdjustmentDto.adjustmentType === 'increase' 
      ? createStockAdjustmentDto.quantity 
      : -createStockAdjustmentDto.quantity;
    
    await this.updateProductStock(createStockAdjustmentDto.productId, quantity, 'adjustment');
    
    return savedAdjustment;
  }

  findAllStockAdjustment(query: any) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    return this.stockAdjustmentRepository.find({
      skip,
      take: limit,
      order: { createTime: 'DESC' },
    });
  }

  async getProductStock(productId: number) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    return {
      productId,
      currentStock: product?.stock || 0,
      alertStock: product?.alertStock || 10,
    };
  }

  async getLowStockProducts() {
    return this.productRepository.find({
      where: {
        stock: LessThanOrEqual(10), // 库存低于10的商品
        isActive: true,
      },
    });
  }

  async getStockStatistics() {
    const totalProducts = await this.productRepository.count();
    const lowStockProducts = await this.productRepository.count({
      where: {
        stock: LessThanOrEqual(10),
        isActive: true,
      },
    });
    
    const totalStockValue = await this.productRepository
      .createQueryBuilder('product')
      .select('SUM(product.stock * product.costPrice)', 'totalValue')
      .getRawOne();

    return {
      totalProducts,
      lowStockProducts,
      totalStockValue: totalStockValue?.totalValue || 0,
    };
  }

  private async updateProductStock(productId: number, quantity: number, type: string) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (product) {
      if (type === 'increase') {
        product.stock += quantity;
      } else if (type === 'decrease') {
        product.stock = Math.max(0, product.stock - quantity);
      } else if (type === 'adjustment') {
        product.stock = Math.max(0, product.stock + quantity);
      }
      await this.productRepository.save(product);
    }
  }
} 