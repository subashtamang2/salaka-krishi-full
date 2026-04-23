import { CurrentUser } from "./schema";

export enum CouponType {
  Percentage = "Percentage",
  FixedAmount = "FixedAmount",
}

export interface CreateCoupon {
  code: string;
  type: CouponType;
  discount: number;
  startDate: string | null;
  expiryDate: string | null;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  maxUsageLimit?: number;
}

export interface CouponSchema extends CreateCoupon {
  id: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: CurrentUser;
  updatedBy?: CurrentUser;
}
