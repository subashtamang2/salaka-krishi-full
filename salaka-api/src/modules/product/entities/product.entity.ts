
import { Exclude, Expose, Type } from "class-transformer";
import {
    IsArray,
    IsBoolean,
    IsDate,
    IsEnum,
    IsNumber,
    IsString,
    IsUUID,
} from "class-validator";
import { AVAILABILITY, PRODUCT_STATUS } from "@prisma/client";

export class CategoryDto {
    @Expose() id: string;
    @Expose() name: string;
    @Expose() slug: string;
}

class UserDto {
    @Expose() id: string;
    @Expose() firstName: string;
    @Expose() lastName: string;
    @Expose() profileUrl: string;
}

class ReviewDto {
    @Expose() id: string;
    @Expose() rating: number;
    @Expose() comment: string;
}

class CountDto {
    @Expose() reviews: number;
}

export class Product {
    @Expose()
    @IsUUID()
    id: string;

    @Expose()
    @IsString()
    name: string;

    @Expose()
    @IsString()
    slug: string;
    @Expose()
    @IsString()
    description: string;

    @Expose()
    @IsNumber()
    price: number;

    @Expose()
    @IsArray({ each: true })
    imageUrls: string[];

    @Expose()
    @IsNumber()
    rating: number;

    @Expose()
    @IsEnum(AVAILABILITY)
    availability: AVAILABILITY;

    @Expose()
    @IsBoolean()
    isFeatured: boolean;

    @Expose()
    @IsBoolean()
    isBlackFriday: boolean;




    @Expose()
    @IsNumber()
    sold: number;

    @Expose()
    @IsNumber()
    stock: number;


    @IsNumber({ maxDecimalPlaces: 1 })
    @Expose()
    discountPercentage: number;

    @Expose()
    @IsDate()
    discountStartDate: Date;

    @Expose()
    @IsDate()
    discountEndDate: Date;

    @Expose()
    @IsString()
    tags: string[];

    @Expose()
    @IsNumber()
    estimatedDeliveryMinDays: number;

    @Expose()
    @IsNumber()
    estimatedDeliveryMaxDays: number;

    @Expose()
    @IsEnum(PRODUCT_STATUS)
    status: PRODUCT_STATUS;

    @Expose()
    @Type(() => CategoryDto)
    category: CategoryDto;

    @Expose()
    @Type(() => ReviewDto)
    reviews: ReviewDto[];

    @Expose()
    @Type(() => UserDto)
    user: UserDto;

    @Expose()
    @IsBoolean()
    isInWishlist: boolean;

    @Expose()
    @IsBoolean()
    isInCart: boolean;

    @Expose()
    @IsDate()
    createdAt: Date;

    @Expose()
    @IsDate()
    updatedAt: Date;

    @Exclude()
    cart: any;

    @Expose()
    @Type(() => CountDto)
    _count: CountDto;

    @Exclude()
    wishlist: any;


    @Exclude()
    userId: string;

    @Exclude()
    categoryId: string;

    @Exclude()
    addedBy: string;
}
