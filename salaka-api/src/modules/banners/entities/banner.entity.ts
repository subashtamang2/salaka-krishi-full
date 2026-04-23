import { Expose, Type } from "class-transformer";
import { Product } from "../../product/entities/product.entity";
export class Banner {
    @Expose()
    id: string;

    @Expose()
    title: string;

    @Expose()
    slug: string;

    @Expose()
    subtitle?: string;

    @Expose()
    description: string;

    @Expose()
    imageUrl: string;

    @Expose()
    buttonLink?: string;

    @Expose()
    productId?: string;

    @Expose()
    @Type(() => Product)
    product?: Product;


    @Expose()
    tag?: string;

    @Expose()
    startDate?: Date;

    @Expose()
    endDate?: Date;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Expose()
    addedBy: string;

    @Expose()
    isActive: boolean;

}
