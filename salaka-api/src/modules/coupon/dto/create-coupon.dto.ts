import { ApiProperty } from "@nestjs/swagger";

import { Type } from "class-transformer";
import {
  IsDate,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { COUPON_TYPE } from "generated/prisma/enums";

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "SUMMER212" })
  code: string;

  @IsNumber({ maxDecimalPlaces: 1 })
  @IsDefined()
  @ApiProperty({ example: 10 })
  discount: number;

  @IsEnum(COUPON_TYPE)
  @IsDefined()
  @ApiProperty({
    example: COUPON_TYPE.Percentage,
    enum: COUPON_TYPE,
    enumName: "COUPON_TYPE",
  })
  type: COUPON_TYPE;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({ example: "2023-12-31T23:59:59.000Z" })
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({ example: "2023-12-31T23:59:59.000Z" })
  expiryDate: Date;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 50 })
  minPurchaseAmount?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 200 })
  maxDiscountAmount?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 100 })
  maxUsageLimit?: number;
}
