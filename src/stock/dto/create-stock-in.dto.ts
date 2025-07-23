export class CreateStockInItemDto {
  productId: number;
  quantity: number;
  price: number;
  totalPrice: number;
}

export class CreateStockInDto {
  stockInNumber: string;
  supplier: string;
  totalAmount: number;
  remark?: string;
  items: CreateStockInItemDto[];
} 