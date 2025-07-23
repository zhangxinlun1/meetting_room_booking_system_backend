export class CreateOrderItemDto {
  productId: number;
  productName: string;
  productCode: string;
  quantity: number;
  price: number;
  costPrice: number;
  subtotal: number;
  profit: number;
}

export class CreateOrderDto {
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  totalAmount: number;
  profit: number;
  status: string;
  remark?: string;
  items: CreateOrderItemDto[];
} 