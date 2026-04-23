import { ApiProperty } from "@nestjs/swagger";
import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsOptional,
    IsString,
    IsUUID,
} from "class-validator";
import { Type } from "class-transformer";
import { BANNER_TAG } from "../banner.enum";

export class CreateBannerDto {
    @ApiProperty({
        example: "Summer Sale",
    })
    @IsString()
    title: string;

    @ApiProperty({
        example: "summer-sale",
    })
    @IsString()
    slug: string;

    @ApiProperty({
        example: "Up to 50% off on all summer collection items!",
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        example: "Get the best vegetables of the season",
        required: false,
    })
    @IsOptional()
    @IsString()
    subtitle?: string;

    @ApiProperty({
        enum: BANNER_TAG,
        required: false,
    })
    @IsOptional()
    @IsEnum(BANNER_TAG)
    tag?: BANNER_TAG;

    @ApiProperty({
        example: "https://example.com/banners/summer-sale.jpg",
    })
    @IsString()
    imageUrl: string;

    @ApiProperty({
        example: "https://example.com/landing-page",
        required: false,
    })
    @IsOptional()
    @IsString()
    buttonLink?: string;


    @ApiProperty({
        example: "0247ff8a-e90e-443c-b12d-0aba91cec018",
        required: false,
    })
    @IsOptional()
    @IsUUID()
    productId: string;

    @ApiProperty({
        example: "2026-03-08T00:00:00.000Z",
    })
    @Type(() => Date)
    @IsDate()
    startDate: Date;

    @ApiProperty({
        example: "2026-03-31T23:59:59.000Z",
    })
    @Type(() => Date)
    @IsDate()
    endDate: Date;

    @ApiProperty({
        example: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
