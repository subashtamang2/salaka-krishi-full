import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { JwtPayload } from "../auth/interface";
import { WishlistRepo } from "./wishlist.repo";

@Injectable()
export class WishlistService {
  constructor(private readonly wishlistRepo: WishlistRepo) {}

  async create(productId: string, user: JwtPayload) {
    const userId = user.sub;

    let wishlist;
    wishlist = await this.wishlistRepo.findWishlistByUserId(userId);
    if (!wishlist) {
      wishlist = await this.wishlistRepo.createWishlist(userId);
    }
    const wishlistProduct = await this.wishlistRepo.checkUserWishlistProduct(
      wishlist.id,
      productId
    );

    if (wishlistProduct) {
      const removedProduct = await this.wishlistRepo.removeWishlistProduct(
        productId,
        wishlist.id
      );
      if (!removedProduct) {
        throw new InternalServerErrorException(
          "Failed to remove product from wishlist"
        );
      }
      return {
        data: removedProduct,
        message: "Wishlist item removed successfully",
      };
    }

    const wishlistAddedProduct = await this.wishlistRepo.addProductToWishlist(
      wishlist.id,
      productId
    );

    if (!wishlistAddedProduct) {
      throw new InternalServerErrorException(
        "Failed to add product to wishlist"
      );
    }
    return {
      data: wishlistAddedProduct,
      message: "Wishlist item added successfully",
    };
  }
  async findAll(user: JwtPayload) {
    const userId = user.sub;
    const wishlist = await this.wishlistRepo.findWishlistProductsByUserId(
      userId
    );
    if (!wishlist) {
      return {
        id: "",
        userId: userId,
        products: [],
        createdAt: new Date(),
      };
    }
    const { products, ...rest } = wishlist;
    const arrangedProducts = products.map((item) => item.product);
    return {
      ...rest,
      products: arrangedProducts,
    };
  }
  async remove(id: string, user: JwtPayload) {
    const wishlist = await this.wishlistRepo.findWishlistByUserId(user.sub);
    if (!wishlist) {
      throw new NotFoundException("Wishlist not found");
    }
    const remove = await this.wishlistRepo.removeWishlistProduct(
      id,
      wishlist.id
    );
    if (!remove) {
      throw new NotFoundException("Product not found in wishlist");
    }
    return remove;
  }
}
