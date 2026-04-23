import { Expose, Type } from "class-transformer";
import { IsBoolean, IsNumber, IsString, IsUUID } from "class-validator";
export class UserDto {
    @Expose()
    @IsUUID()
    id: string;

    @Expose()
    @IsString()
    firstName: string;

    @Expose()
    @IsString()
    lastName: string;

    @Expose()
    @IsString()
    profileUrl: string;

    @Expose()
    @IsBoolean()
    isGoogleLogin: boolean;
}

export class ProductDto {
    @Expose()
    @IsUUID()
    @IsString()
    id: string;

    @Expose()
    @IsString()
    name: string;

    @Expose()
    @IsString()
    slug: string;
}

export class ReviewResponseDto {
    @Expose()
    @IsUUID()
    id: string;

    @Expose()
    @IsString()
    comment: string;

    @Expose()
    @IsNumber({ maxDecimalPlaces: 1 })
    rating: number;

    @Expose()
    @Type(() => UserDto)
    User: UserDto;

    @Expose()
    @Type(() => ProductDto)
    Product: ProductDto;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}

export class ReviewPaginationResponseDto {
    @Expose()
    @IsNumber()
    total_no_of_reviews: number;
    @Expose()
    @IsNumber()
    current_reviews: number;

    @Expose()
    @Type(() => ReviewResponseDto)
    reviews: ReviewResponseDto[];
}
