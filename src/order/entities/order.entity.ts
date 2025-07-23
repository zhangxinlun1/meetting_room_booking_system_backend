import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '订单编号',
    unique: true,
  })
  orderNumber: string;

  @Column({
    length: 100,
    comment: '客户姓名',
    nullable: true,
  })
  customerName: string;

  @Column({
    length: 20,
    comment: '客户电话',
    nullable: true,
  })
  customerPhone: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: '订单总金额',
  })
  totalAmount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: '订单利润',
    default: 0,
  })
  profit: number;

  @Column({
    length: 20,
    comment: '订单状态',
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