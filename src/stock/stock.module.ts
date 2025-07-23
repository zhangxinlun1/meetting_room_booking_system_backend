import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { StockIn } from './entities/stock-in.entity';
import { StockInItem } from './entities/stock-in-item.entity';
import { StockAdjustment } from './entities/stock-adjustment.entity';
import { Product } from '../product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockIn, StockInItem, StockAdjustment, Product])],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {} 