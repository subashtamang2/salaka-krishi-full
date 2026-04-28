import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from "@nestjs/common";
import { WishlistService } from "./wishlist.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";
import { JwtPayload } from "../auth/interface";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Serializer } from "../../interceptors/serializer.interceptor";
import { Roles } from "../auth/decorators/roles.decorators";
import { wishlist } from "./entities/wishlist.entity";
import { ROLE } from "@prisma/client";

@Controller("wishlist")
@Serializer(wishlist)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLE.User)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post(":ProductId")
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.User)
  async create(
    @Req() req: Request & { user: JwtPayload },
    @Param("ProductId") ProductId: string
  ) {
    const user = req?.user;
    const { data, message } = await this.wishlistService.create(
      ProductId,
      user
    );
    return {
      message: message,
      data: data,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.User)
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request & { user: JwtPayload }) {
    const user = req?.user;
    const wishlistProducts = await this.wishlistService.findAll(user);
    return {
      message: "Wishlist items retrieved successfully",
      data: wishlistProducts,
    };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.User)
  async remove(
    @Req() req: Request & { user: JwtPayload },
    @Param("id") id: string
  ) {
    const user = req?.user;
    const wishlist = await this.wishlistService.remove(id, user);
    return {
      message: "Wishlist item removed successfully",
      data: wishlist,
    };
  }
}
