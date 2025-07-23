import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../product/entities/product.entity';

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '订单ID',
  })
  orderId: number;

  @Column({
    comment: '商品ID',
  })
  productId: number;

  @Column({
    length: 100,
    comment: '商品名称',
  })
  productName: string;

  @Column({
    length: 50,
    comment: '商品编码',
  })
  productCode: string;

  @Column({
    type: 'int',
    comment: '销售数量',
  })
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: '销售单价',
  })
  price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: '小计金额',
  })
  subtotal: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: '成本价',
  })
  costPrice: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: '利润',
    default: 0,
  })
  profit: number;

  @ManyToOne(() => Order, order => order.id)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Product, product => product.id)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
} 