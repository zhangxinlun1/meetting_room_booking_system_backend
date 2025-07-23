import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockInDto } from './dto/create-stock-in.dto';
import { CreateStockAdjustmentDto } from './dto/create-stock-adjustment.dto';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  // 入库管理
  @Post('in')
  createStockIn(@Body() createStockInDto: CreateStockInDto) {
    return this.stockService.createStockIn(createStockInDto);
  }

  @Get('in')
  findAllStockIn(@Query() query: any) {
    return this.stockService.findAllStockIn(query);
  }

  @Get('in/:id')
  findOneStockIn(@Param('id') id: string) {
    return this.stockService.findOneStockIn(+id);
  }

  // 库存调整
  @Post('adjustment')
  createStockAdjustment(@Body() createStockAdjustmentDto: CreateStockAdjustmentDto) {
    return this.stockService.createStockAdjustment(createStockAdjustmentDto);
  }

  @Get('adjustment')
  findAllStockAdjustment(@Query() query: any) {
    return this.stockService.findAllStockAdjustment(query);
  }

  // 库存查询
  @Get('product/:productId')
  getProductStock(@Param('productId') productId: string) {
    return this.stockService.getProductStock(+productId);
  }

  @Get('low-stock')
  getLowStockProducts() {
    return this.stockService.getLowStockProducts();
  }

  @Get('statistics')
  getStockStatistics() {
    return this.stockService.getStockStatistics();
  }
} 