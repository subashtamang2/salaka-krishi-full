import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from "class-validator";

export class CreateSiteInfoDto {
  @IsString()
  @ApiProperty({ example: "My Awesome Site" })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: "https://example.com/logo.png", required: false })
  logoUrl?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ApiProperty({ example: ["ecommerce", "shopping", "online store"], required: false })
  keywords?: string[];

  @IsString()
  @IsOptional()
  @ApiProperty({ example: "This is an awesome e-commerce site.", required: false })
  description?: string;

  @IsEmail()
  @IsString()
  @ApiProperty({ example: "contact@example.com" })
  email: string;

  @IsString()
  @ApiProperty({ example: "+1234567890" })
  phone: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: "123 Main St, Anytown, USA", required: false })
  address?: string;
}

export class SocialMediaLinksDto {
  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({
    example: "https://facebook.com/my-page",
  })
  facebook?: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({
    example: "https://instagram.com/my-page",
  })
  instagram?: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({
    example: "https://twitter.com/my-page",
  })
  twitter?: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({
    example: "https://youtube.com/my-page",
  })
  youtube?: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({
    example: "https://linkedin.com/my-page",
  })
  linkedin?: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({
    example: "https://pinterest.com/my-page",
  })
  pinterest?: string;
}

export class UpsertSocialMediaDto {
  @IsObject()
  @Type(() => SocialMediaLinksDto)
  @ApiProperty({
    type: SocialMediaLinksDto,
  })
  socialMediaLinks: SocialMediaLinksDto;
}
