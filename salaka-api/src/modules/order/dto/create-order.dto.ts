import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { PAYMENT_PROVIDER } from '@prisma/client';
export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsEnum(PAYMENT_PROVIDER)
  @IsOptional()
  paymentProvider?: PAYMENT_PROVIDER;

  @IsString()
  @IsOptional()
  couponCode?: string;
}
