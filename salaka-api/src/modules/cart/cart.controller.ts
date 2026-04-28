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
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import { CartService } from "./cart.service";
import { CreateCartDto } from "./dto/create-cart.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Request } from "express";
import { JwtPayload } from "../auth/interface";
import { Serializer } from "../../interceptors/serializer.interceptor";
import { Cart } from "./entities/cart.entity";
import { ROLE } from "@prisma/client";
import { Roles } from "../auth/decorators/roles.decorators";

@Controller("cart")
@Serializer(Cart)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.User)
  async create(
    @Body() createCartDto: CreateCartDto,
    @Req() req: Request & { user: JwtPayload }
  ) {
    const user = req.user;
    const data = await this.cartService.create(createCartDto, user);
    return {
      message: "Cart created successfully",
      data: data,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.User)
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request & { user: JwtPayload }) {
    const user = req.user;
    const data = await this.cartService.findAll(user);
    return {
      message: "Cart fetched successfully",
      data: data,
    };
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.User)
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param("id") id: string,
    @Req() req: Request & { user: JwtPayload }
  ) {
    const user = req.user;
    const data = await this.cartService.findOne(id, user.sub);
    return {
      message: "Cart item fetched successfully",
      data: {
        ...data?.product,
        quantity: data?.quantity,
        totalPrice: data?.product && data?.quantity * data.product.price,
      },
    };
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.User)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param("id") id: string,
    @Body("quantity") quantity: number,
    @Req() req: Request & { user: JwtPayload }
  ) {
    const user = req.user;
    const data = await this.cartService.update(id, quantity, user.sub);
    return {
      message: "Cart item updated successfully",
      data: data,
    };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.User)
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param("id") id: string,
    @Req() req: Request & { user: JwtPayload }
  ) {
    const user = req.user;
    const data = await this.cartService.remove(id, user.sub);
    return {
      message: "Cart item removed successfully",
      data: {
        ...data?.product,
        quantity: data?.quantity,
        totalPrice: data?.product && data?.quantity * data.product.price,
        createdAt: data.createdAt,
      },
    };
  }
}
