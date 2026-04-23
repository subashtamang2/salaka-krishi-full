import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
export class CreateBlogDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  shortDesc?: string;

  @ApiProperty({ required: false })
  @IsString()
  imageUrl: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: "d9df350b-c9dghghg7-4d10-9219-61f7c5f45e89",
  })
  categoryId: string;


  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsString({ each: true })
  keywords?: string[];
}
