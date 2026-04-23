
import { Expose } from "class-transformer";
import { COUPON_TYPE } from "generated/prisma/enums";

export class CouponResponseDto {
  @Expose()
  id: string;
  @Expose()
  code: string;
  @Expose()
  discount: number;
  @Expose()
  type: COUPON_TYPE;
  @Expose()
  startDate: Date;
  @Expose()
  expiryDate: Date;
  @Expose()
  minPurchaseAmount?: number;
  @Expose()
  maxDiscountAmount?: number;
  @Expose()
  usageCount: number;
  @Expose()
  maxUsageLimit?: number;
  @Expose()
  createdBy: string;
  @Expose()
  updatedBy: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;

  @Expose()
  discountAmount?: number;

  @Expose()
  discountValue?: number;

  @Expose()
  finalTotal?: number;
}
