import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CheckoutSummaryRequestDto {
  @ApiPropertyOptional({ description: 'Optional coupon code to apply' })
  @IsString()
  @IsOptional()
  couponCode?: string;
}

export class CheckoutSummaryResponseDto {
  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  deliveryCharge: number;

  @ApiProperty()
  total: number;
}
