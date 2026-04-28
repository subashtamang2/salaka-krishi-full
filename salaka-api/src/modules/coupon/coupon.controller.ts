import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
  NotFoundException,
} from "@nestjs/common";
import { CouponService } from "./coupon.service";
import { CreateCouponDto } from "./dto/create-coupon.dto";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";

import { Request } from "express";
import { JwtPayload } from "../auth/interface";
import { Serializer } from "../../interceptors/serializer.interceptor";
import { CouponResponseDto } from "./entities/coupon.entity";
import { ROLE } from "@prisma/client";
import { Roles } from "../auth/decorators/roles.decorators";
import { UpdateCouponDto } from "./dto/update_coupon.dto";

@Controller("coupon")
@Serializer(CouponResponseDto)
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Roles(ROLE.Admin, ROLE.SuperAdmin, ROLE.User)
  async create(
    @Req() req: Request & { user: JwtPayload },
    @Body() createCouponDto: CreateCouponDto
  ) {
    const user = req.user;
    const coupon = await this.couponService.create(createCouponDto, user.sub);
    return {
      message: "Coupon created successfully",
      data: coupon,
    };
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin, ROLE.User)
  async findAll(@Req() req: Request & { user: JwtPayload }) {
    const user = req.user;
    const coupons = await this.couponService.findAll(user);
    if (coupons.length === 0) {
      throw new NotFoundException("No coupons found");
    }
    return {
      message: "All coupons retrieved successfully",
      data: coupons,
    };
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  async findOne(
    @Req() req: Request & { user: JwtPayload },
    @Param("id") id: string
  ) {
    const coupon = await this.couponService.findOne(id);
    return {
      message: "Coupon retrieved successfully",
      data: coupon,
    };
  }

  @Get("code/:code")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.User)
  async findByCode(
    @Req() req: Request & { user: JwtPayload },
    @Param("code") code: string,
    @Query("totalAmount") totalAmount?: string
  ) {
    const user = req.user;
    const result = await this.couponService.calculateDiscount(
      code,
      user.sub,
      totalAmount ? Number(totalAmount) : 0
    );
    return {
      message: "Coupon details retrieved successfully",
      data: result,
    };
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  async update(
    @Param("id") id: string,
    @Req() req: Request & { user: JwtPayload },
    @Body() updateCouponDto: UpdateCouponDto
  ) {
    const user = req.user;
    const updatedCoupon = await this.couponService.update(
      id,
      updateCouponDto,
      user.sub
    );
    return {
      message: "Coupon updated successfully",
      data: updatedCoupon,
    };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  async remove(@Param("id") id: string) {
    const deactivateToken = await this.couponService.remove(id);
    return {
      message: "Coupon deactivated successfully",
      data: deactivateToken,
    };
  }
}
