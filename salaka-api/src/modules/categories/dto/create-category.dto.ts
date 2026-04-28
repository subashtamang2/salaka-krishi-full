import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { CATEGORY_STATUS } from "@prisma/client";

export class CreateCategoryDto {
  @ApiProperty({ example: "Electronics" })
  @IsString()
  name: string;

  @ApiProperty({ example: "electronics" })
  @IsString()
  slug: string;

  @ApiProperty({ example: "https://example.com/img1.png" })
  @IsOptional()
  @IsString()
  imageUrl: string;

  @ApiProperty({
    example: CATEGORY_STATUS.Active,
    enum: CATEGORY_STATUS,
    enumName: "CATEGORY_STATUS",
  })
  @IsEnum(CATEGORY_STATUS)
  status: CATEGORY_STATUS;
}
