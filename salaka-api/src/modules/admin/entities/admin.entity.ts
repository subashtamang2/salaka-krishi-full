import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsDate, IsEnum, IsString, IsUUID } from "class-validator";
import {
    Blog,
    Cart,
    Product,
    Reviews,
    UseCouponCode,
    Wishlist
} from "generated/prisma/client";
import { ROLE, USER_STATUS } from "generated/prisma/enums";

export class AdminReponse {
    @ApiProperty()
    @Expose()
    @IsUUID()
    id: string;

    @ApiProperty()
    @Expose()
    @IsString()
    firstName: string;

    @ApiProperty()
    @Expose()
    @IsString()
    lastName: string;

    @ApiProperty()
    @Expose()
    @IsString()
    profileUrl: string;

    @ApiProperty()
    @Expose()
    @IsString()
    email: string;

    @ApiProperty()
    @Expose()
    @IsEnum(ROLE)
    role: ROLE;

    @ApiProperty()
    @Expose()
    @IsEnum(USER_STATUS)
    status: USER_STATUS;

    @ApiProperty()
    @Expose()
    @IsDate()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    @IsDate()
    updatedAt: Date;

    @Exclude()
    password: string;

    @Expose()
    _count: {
        blogs: number;
        shops: number;
        products: number;
    };
    @Expose()
    blogs: Blog[];
    @Expose()
    products: Product[];
    @Expose()
    Wishlist: Wishlist[];
    @Expose()
    Cart: Cart[];
    @Expose()
    comments: Comment[];
    @Expose()
    Reviews: Reviews[];
    @Expose()
    couponCodes: UseCouponCode[];
}
