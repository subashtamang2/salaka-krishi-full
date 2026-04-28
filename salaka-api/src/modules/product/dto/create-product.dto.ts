import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
    IsLowercase,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsNumber,
    IsBoolean,
    IsDate,
    IsUUID,
    IsEnum,
    IsArray,
    ArrayMaxSize,
} from "class-validator";
import { AVAILABILITY, PRODUCT_STATUS } from "@prisma/client";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "Sample Product",
    })
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsLowercase()
    @ApiProperty({
        example: "sample-product",
    })
    slug: string;

    @IsString()
    @ApiProperty({
        example: "This is a sample product description.",
    })
    description: string;


    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    @ApiProperty({
        example: 200.0,
    })
    price: number;

    @IsString({ each: true })
    @ApiProperty({
        example: [
            "https://example.com/image1.jpg",
            "https://example.com/image2.jpg",
        ],
    })
    imageUrls: string[];

    @IsNumber({ maxDecimalPlaces: 1 })
    @IsOptional()
    @ApiProperty({
        example: 4.5,
    })
    rating?: number;

    @IsEnum(AVAILABILITY)
    @IsOptional()
    @ApiProperty({
        example: AVAILABILITY.InStock,
        enum: AVAILABILITY,
        enumName: "AVAILABILITY",
    })
    availability?: AVAILABILITY;



    @IsNumber()
    @IsOptional()
    @ApiProperty({
        example: 2,
        description: "Minimum estimated delivery days",
    })
    estimatedDeliveryMinDays?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        example: 3,
        description: "Maximum estimated delivery days",
    })
    estimatedDeliveryMaxDays?: number;







    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        example: true,
    })
    isFeatured?: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        example: true,
    })
    isBlackFriday?: boolean;

    @IsNumber({ maxDecimalPlaces: 0 })
    @IsNotEmpty()
    @ApiProperty({
        example: 100,
    })
    stock: number;

    @IsNumber({ maxDecimalPlaces: 0 })
    @IsOptional()
    @ApiProperty({
        example: 50,
    })
    sold: number;


    @IsNumber({ maxDecimalPlaces: 1 })
    @IsOptional()
    @ApiProperty({
        example: 50,
    })
    discountPercentage?: number;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    @ApiProperty({
        example: "2025-6-01T00:00:00.000Z",
    })
    discountStartDate?: Date;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    @ApiProperty({
        example: "2025-10-15T00:00:00.000Z",
    })
    discountEndDate?: Date;

    @IsString({ each: true })
    @IsNotEmpty()
    @ApiProperty({
        example: ["sample", "product", "electronics"],
    })
    tags: string[];

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        example: "d9df350b-c9d7-4d10-9219-61f7c5f45e89",
    })
    categoryId: string;

  

    @ApiProperty({
        example: PRODUCT_STATUS.Active,
        enum: PRODUCT_STATUS,
        enumName: "PRODUCT_STATUS",
    })
    @IsEnum(PRODUCT_STATUS)
    status: PRODUCT_STATUS;
}

export class FilterProductsDto {
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) =>
        typeof value === "string" ? value.split(",") : value
    )
    categories?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) =>
        typeof value === "string" ? value.split(",") : value
    )
    availability?: string[];
    @IsOptional()
    @IsString()
    @Transform(({ value }) => (typeof value === "string" ? value.replace(/,/g, " ") : value))
    search?: string;

    @IsOptional()
    @IsString()
    tag?: string;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === "true" || value === true)
    isNewArrival?: boolean;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === "true" || value === true)
    isBestSelling?: boolean;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === "true" || value === true)
    isLimitedStock?: boolean;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === "true" || value === true)
    isTopRated?: boolean;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === "true" || value === true)
    isFeatured?: boolean;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === "true" || value === true)
    isBlackFriday?: boolean;

    @IsOptional()
    @IsEnum(PRODUCT_STATUS)
    status?: PRODUCT_STATUS;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number;

    @IsOptional()
    @IsString()
    sortBy?: string;

    @IsOptional()
    @IsString()
    sortOrder?: 'asc' | 'desc';
}
