import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StockIn } from './stock-in.entity';
import { Product } from '../../product/entities/product.entity';

@Entity({ name: 'stock_in_items' })
export class StockInItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '入库单ID',
  })
  stockInId: number;

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
    comment: '入库数量',
  })
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: '进货单价',
  })
  costPrice: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: '小计金额',
  })
  subtotal: number;

  @ManyToOne(() => StockIn, stockIn => stockIn.id)
  @JoinColumn({ name: 'stockInId' })
  stockIn: StockIn;

  @ManyToOne(() => Product, product => product.id)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
} 