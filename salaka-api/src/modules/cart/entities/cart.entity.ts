import { Exclude, Expose, Type } from "class-transformer";
import { Product } from "src/modules/product/entities/product.entity";

class CartItemResponse {
  @Expose()
  @Type(() => Product)
  product: Product;

  @Expose()
  quantity: number;

  @Expose()
  totalPrice: number;
}

export class Cart {
  @Expose()
  id: string;
  @Exclude()
  userId: string;
  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => CartItemResponse)
  products: CartItemResponse[];

  @Expose()
  totalItems: number;
  @Expose()
  totalAmount: number;
}
