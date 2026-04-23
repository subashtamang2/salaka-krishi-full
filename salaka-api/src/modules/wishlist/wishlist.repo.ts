import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class WishlistRepo {
  constructor(private readonly prisma: PrismaService) {}

  findWishlistByUserId(userId: string) {
    return this.prisma.wishlist.findUnique({
      where: { userId },
    });
  }

  createWishlist(userId: string) {
    return this.prisma.wishlist.create({
      data: { userId },
    });
  }

  checkUserWishlistProduct(wishlistId: string, productId: string) {
    return this.prisma.wishlistProducts.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId,
          productId,
        },
      },
    });
  }

  addProductToWishlist(wishlistId: string, productId: string) {
    return this.prisma.wishlistProducts.create({
      data: {
        wishlistId,
        productId,
      },
    });
  }

  removeWishlistProduct(productId: string, wishlistId: string) {
    return this.prisma.wishlistProducts.delete({
      where: {
        wishlistId_productId: {
          wishlistId: wishlistId,
          productId: productId,
        },
      },
    });
  }

  findWishlistProductsByUserId(userId: string) {
    return this.prisma.wishlist.findUnique({
      where: { userId },
      include: {
        products: {
          select: {
            product: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }
}
