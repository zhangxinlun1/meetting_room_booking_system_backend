import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'stock_adjustments' })
export class StockAdjustment {
  @PrimaryGeneratedColumn()
  id: number;

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
    type: 'int',
    comment: '调整前库存',
  })
  oldStock: number;

  @Column({
    type: 'int',
    comment: '调整后库存',
  })
  newStock: number;

  @Column({
    type: 'int',
    comment: '调整数量',
  })
  quantity: number;

  @Column({
    length: 20,
    comment: '调整类型',
  })
  type: string; // increase, decrease, set

  @Column({
    length: 100,
    comment: '调整原因',
  })
  reason: string;

  @Column({
    length: 500,
    comment: '备注',
    nullable: true,
  })
  remark: string;

  @Column({
    length: 50,
    comment: '操作人',
    nullable: true,
  })
  operator: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
} 