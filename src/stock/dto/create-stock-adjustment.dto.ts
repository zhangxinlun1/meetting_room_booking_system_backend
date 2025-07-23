export class CreateStockAdjustmentDto {
  productId: number;
  adjustmentType: string; // 'increase' | 'decrease'
  quantity: number;
  reason: string;
  remark?: string;
} 