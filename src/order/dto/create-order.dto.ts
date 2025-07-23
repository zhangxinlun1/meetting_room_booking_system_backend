export class CreateOrderItemDto {
  productId: number;
  quantity: number;
  price: number;
  costPrice: number;
  totalPrice: number;
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