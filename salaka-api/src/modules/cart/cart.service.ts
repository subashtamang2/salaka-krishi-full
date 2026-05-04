import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCartDto } from "./dto/create-cart.dto";
import { JwtPayload } from "../auth/interface";
import { CartStrategy } from "./cart.strategy";
import { ConfigService } from "@nestjs/config";

import { ProductRepository } from "../product/product.repo";
 
@Injectable()
export class CartService {
  constructor(
    private readonly cartStrategy: CartStrategy,
    private readonly config: ConfigService,
    private readonly productRepo: ProductRepository,
  ) {}

  async create(createCartDto: CreateCartDto, user: JwtPayload) {
    const userId = user.sub;
    let cart;
    cart = await this.cartStrategy.findUserCart(userId);
    if (!cart) cart = await this.cartStrategy.createCart(userId);
 
    // Verify Product Existence
    const product = await this.productRepo.findProductById(createCartDto.productId);
    if (!product) throw new NotFoundException("Product not found");

    const cartProduct = await this.cartStrategy.addProductsToCart(
      createCartDto,
      cart.id
    );
    if (!cartProduct) {
      throw new NotFoundException("Failed to add product to cart.");
    }
    return cartProduct;
  }

  async findAll(user: JwtPayload) {
    const userId = user.sub;
    const cart = await this.cartStrategy.findAll(userId);

    if (!cart) {
      return {
        id: "",
        userId: userId,
        products: [],
        totalItems: 0,
        totalAmount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    const { products, ...rest } = cart;
    const cartProducts = cart.products.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      totalPrice: item.quantity * item.product.price,
    }));

    const totalAmount = cartProducts.reduce(
      (acc, curr) => acc + curr.totalPrice,
      0
    );

    return {
      ...rest,
      products: cartProducts,
      totalItems: products.length,
      totalAmount,
    };
  }

  async findOne(id: string, userId: string) {
    const cart = await this.cartStrategy.findOne(id, userId);
    return cart;
  }

  async update(id: string, Quantity: number, userId: string) {
    const cart = await this.cartStrategy.update(id, Quantity, userId);
    return cart;
  }

  async remove(id: string, userId: string) {
    const cart = await this.cartStrategy.remove(id, userId);
    return cart;
  }

  async clearCart(cartId: string) {
    return this.cartStrategy.clearCart(cartId);
  }
}
