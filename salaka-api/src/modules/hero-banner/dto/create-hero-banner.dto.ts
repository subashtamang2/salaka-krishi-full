import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID, IsOptional, IsBoolean, IsNumber } from "class-validator";

export class CreateHeroBannerDto {

  @ApiProperty({
    example: "Looking for Fresh Organic Vegetables"
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: "ORGANIC VEGETABLES",
    required: false
  })
  @IsOptional()
  @IsString()
  tagLine?: string;

  @ApiProperty({
    example: "https://example.com/banner.jpg"
  })
  @IsString()
  imageUrl: string;

  @ApiProperty({
    example: "category-id"
  })
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
