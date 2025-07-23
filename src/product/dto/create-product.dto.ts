export class CreateProductDto {
  name: string;
  code: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  unit: string;
  description?: string;
  image?: string;
  status: string;
} 