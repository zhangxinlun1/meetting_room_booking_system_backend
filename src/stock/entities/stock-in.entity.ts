import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'stock_ins' })
export class StockIn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '入库单号',
    unique: true,
  })
  stockInNumber: string;

  @Column({
    length: 100,
    comment: '供应商',
    nullable: true,
  })
  supplier: string;

  @Column({
    length: 20,
    comment: '供应商联系方式',
    nullable: true,
  })
  contact: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: '入库总金额',
  })
  totalAmount: number;

  @Column({
    type: 'int',
    comment: '入库商品总数',
  })
  totalQuantity: number;

  @Column({
    length: 20,
    comment: '入库状态',
    default: 'completed',
  })
  status: string;

  @Column({
    length: 500,
    comment: '备注',
    nullable: true,
  })
  remark: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
} 