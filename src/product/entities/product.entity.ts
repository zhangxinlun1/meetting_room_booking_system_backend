import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    comment: '商品名称',
  })
  name: string;

  @Column({
    length: 50,
    comment: '商品编码',
    unique: true,
  })
  code: string;

  @Column({
    length: 50,
    comment: '商品分类',
  })
  category: string;

  @Column({
    length: 50,
    comment: '品牌',
    nullable: true,
  })
  brand: string;

  @Column({
    length: 100,
    comment: '规格',
    nullable: true,
  })
  specification: string;

  @Column({
    length: 50,
    comment: '颜色',
    nullable: true,
  })
  color: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: '进货价',
  })
  costPrice: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: '销售价',
  })
  salePrice: number;

  @Column({
    type: 'int',
    comment: '库存数量',
    default: 0,
  })
  stock: number;

  @Column({
    type: 'int',
    comment: '预警库存',
    default: 10,
  })
  alertStock: number;

  @Column({
    type: 'int',
    comment: '已售数量',
    default: 0,
  })
  soldCount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: '总销售额',
    default: 0,
  })
  totalRevenue: number;

  @Column({
    length: 500,
    comment: '商品描述',
    nullable: true,
  })
  description: string;

  @Column({
    length: 500,
    comment: '商品图片',
    nullable: true,
  })
  images: string;

  @Column({
    length: 100,
    comment: '主图',
    nullable: true,
  })
  img: string;

  @Column({
    comment: '是否上架',
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
} 