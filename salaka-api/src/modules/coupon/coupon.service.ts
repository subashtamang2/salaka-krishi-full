import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { CreateCouponDto } from "./dto/create-coupon.dto";

import { CouponRepository } from "./coupon.repo";
import { JwtPayload } from "../auth/interface";
import { ROLE } from "@prisma/client";
import { UpdateCouponDto } from "./dto/update_coupon.dto";


@Injectable()
export class CouponService {
  constructor(private readonly couponRepo: CouponRepository) {}

  async create(createCouponDto: CreateCouponDto, userId: string) {
    const checkCoupon = await this.couponRepo.findByCode(createCouponDto.code);
    if (checkCoupon) {
      throw new NotAcceptableException("Coupon code already exists");
    }
    const coupon = await this.couponRepo.create(createCouponDto, userId);
    if (!coupon) {
      throw new InternalServerErrorException("Failed to create coupon");
    }
    return coupon;
  }
  async findAll({ role, sub: userId }: JwtPayload) {
    if (role === ROLE.SuperAdmin) {
      const coupons = await this.couponRepo.findAll();
      return coupons;
    }
    const coupons = await this.couponRepo.findCouponCreatedByUser(userId);
    return coupons;
  }
  async findOne(id: string) {
    const coupon = await this.couponRepo.findById(id);
    if (!coupon) {
      throw new NotFoundException("Coupon not found");
    }
    return coupon;
  }
  async calculateDiscount(code: string, userId: string, totalAmount: number) {
    const coupon = await this.couponRepo.findByCode(code);
    if (!coupon) throw new NotFoundException("Invalid coupon code");

    // 1. Check Expiry/Inactivity
    if (coupon.startDate && coupon.startDate > new Date())
      throw new NotAcceptableException("Coupon is not active yet");

    if (coupon.expiryDate && coupon.expiryDate < new Date())
      throw new NotAcceptableException("Coupon is expired");

    // 2. Check Global Usage Limit
    if (coupon.maxUsageLimit && coupon.usageCount >= coupon.maxUsageLimit)
      throw new NotAcceptableException("Coupon usage limit exceeded");

    // 3. Check Per-User Usage
    const isUsed = await this.couponRepo.checkCouponUsedByUser(
      coupon.id,
      userId
    );

    if (isUsed)
      throw new NotAcceptableException("You have already used this coupon");

    // 4. Validate Minimum Purchase
    if (coupon.minPurchaseAmount && totalAmount < coupon.minPurchaseAmount) {
      throw new NotAcceptableException(
        `Minimum purchase of Rs ${coupon.minPurchaseAmount} required`
      );
    }

    // 5. Calculate Discount
    let discountAmount = 0;
    if (coupon.type === "Percentage") {
      discountAmount = (coupon.discount / 100) * totalAmount;
    } else {
      discountAmount = coupon.discount;
    }

    // 6. Cap with Max Discount Amount
    if (
      coupon.maxDiscountAmount &&
      coupon.maxDiscountAmount > 0 &&
      discountAmount > coupon.maxDiscountAmount
    ) {
      discountAmount = coupon.maxDiscountAmount;
    }

    // Ensure discount doesn't exceed total amount
    if (discountAmount > totalAmount) discountAmount = totalAmount;

    const finalTotal = totalAmount - discountAmount;

    return {
      discountAmount,
      finalTotal,
      code: coupon.code,
      type: coupon.type,
      discountValue: coupon.discount,
      minPurchaseAmount: coupon.minPurchaseAmount,
      maxDiscountAmount: coupon.maxDiscountAmount
    };
  }

  async update(
    id: string,
    updateCouponDto: UpdateCouponDto,
    updatedById: string
  ) {
    const update = await this.couponRepo.update(
      id,
      updateCouponDto,
      updatedById
    );
    if (!update) {
      throw new InternalServerErrorException("Failed to update coupon");
    }
    return update;
  }

  async remove(id: string) {
    const coupon = await this.couponRepo.remove(id);
    return coupon;
  }
}
