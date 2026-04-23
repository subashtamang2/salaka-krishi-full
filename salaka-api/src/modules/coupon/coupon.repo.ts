import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCouponDto } from "./dto/create-coupon.dto";
import { UpdateCouponDto } from "./dto/update_coupon.dto";

@Injectable()
export class CouponRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByCode(code: string) {
    return this.prisma.couponCode.findUnique({
      where: { code },
    });
  }
  create(createCouponDto: CreateCouponDto, userId: string) {
    return this.prisma.couponCode.create({
      data: {
        ...createCouponDto,
        userId,
      },
    });
  }
  findAll() {
    return this.prisma.couponCode.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: {
          select: {
            id: true,
            profileUrl: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            profileUrl: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
  }
  findById(id: string) {
    return this.prisma.couponCode.findUnique({
      where: { id },
    });
  }
  findCouponCreatedByUser(userID: string) {
    return this.prisma.couponCode.findMany({
      orderBy: { createdAt: "desc" },
      where: { userId: userID },
      include: {
        createdBy: {
          select: {
            id: true,
            profileUrl: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }
  checkCouponUsedByUser(codeId: string, userId: string) {
    return this.prisma.useCouponCode.findUnique({
      where: {
        userId_couponCodeId: {
          userId,
          couponCodeId: codeId,
        },
      },
    });
  }
  markCouponAsUsedByUser(couponId: string, userId: string) {
    return this.prisma.useCouponCode.create({
      data: {
        userId,
        couponCodeId: couponId,
      },
    });
  }
  updateCouponUsageCount(couponId: string) {
    return this.prisma.couponCode.update({
      where: {
        id: couponId,
      },
      data: {
        usageCount: { increment: 1 },
      },
    });
  }
  update(id: string, updateCouponDto: UpdateCouponDto, updatedById: string) {
    return this.prisma.couponCode.update({
      where: { id },
      data: { ...updateCouponDto, updatedById },
    });
  }
  remove(id: string) {
    return this.prisma.couponCode.delete({ where: { id } });
  }
}
