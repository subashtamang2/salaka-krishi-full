import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateCartDto } from "./dto/create-cart.dto";
import { JwtPayload } from "../auth/interface";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CartStrategy {
  constructor(private readonly prisma: PrismaService) {}

  findUserCart(userId: string) {
    return this.prisma.cart.findUnique({
      where: { userId },
    });
  }
  createCart(userId: string) {
    return this.prisma.cart.create({
      data: { userId },
    });
  }
  addProductsToCart(createCartDto: CreateCartDto, cartId: string) {
    return this.prisma.cartProduct.create({
      data: {
        ...createCartDto,
        cartId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: {
        products: {
          select: {
            product: true,
            quantity: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: { userId },
    });
    if (!cart) return null;
    const cartProduct = await this.prisma.cartProduct.findUnique({
      where: {
        cartId_productId: { cartId: cart.id, productId: id },
      },
      select: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
          },
        },
        quantity: true,
      },
    });
    return cartProduct;
  }

  async update(id: string, quantity: number, userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new InternalServerErrorException("Cart not found for the user.");
    }

    if (quantity <= 0) {
      return this.prisma.cartProduct.delete({
        where: {
          cartId_productId: { cartId: cart.id, productId: id },
        },
      });
    }

    const cartProduct = await this.prisma.cartProduct.update({
      where: {
        cartId_productId: { cartId: cart.id, productId: id },
      },
      data: {
        quantity: quantity,
      },
    });

    return cartProduct;
  }

  async remove(id: string, userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });
    if (!cart) {
      throw new InternalServerErrorException("Cart not found for the user.");
    }
    return this.prisma.cartProduct.delete({
      where: {
        cartId_productId: { cartId: cart.id, productId: id },
      },
      select: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
          },
        },
        quantity: true,
        createdAt: true,
      },
    });
  }

  async clearCart(cartId: string) {
    return this.prisma.cartProduct.deleteMany({
      where: { cartId },
    });
  }
}
