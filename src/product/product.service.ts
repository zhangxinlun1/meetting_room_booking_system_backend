import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  findAll(query: any) {
    const { page = 1, limit = 10, category, keyword } = query;
    const skip = (page - 1) * limit;
    
    let whereCondition: any = {};
    
    if (category) {
      whereCondition.category = category;
    }
    
    if (keyword) {
      whereCondition.name = Like(`%${keyword}%`);
    }

    return this.productRepository.find({
      where: whereCondition,
      skip,
      take: limit,
      order: { createTime: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.productRepository.findOne({ where: { id } });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.productRepository.update(id, updateProductDto);
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }

  search(keyword: string) {
    return this.productRepository.find({
      where: [
        { name: Like(`%${keyword}%`) },
        { code: Like(`%${keyword}%`) },
        { category: Like(`%${keyword}%`) },
      ],
    });
  }
} 