import { Expose, Type } from "class-transformer";
import { Product } from "../../product/entities/product.entity";

export class wishlist {
    @Expose()
    id: string;
    @Expose()
    createdAt: Date;
    @Expose()
    @Type(() => Product)
    products: Product[];

}
