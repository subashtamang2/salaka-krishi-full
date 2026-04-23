import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { ProductRepository } from "./product.repo";
import { UserModule } from "../user/user.module";
import { WishlistModule } from "../wishlist/wishlist.module";

@Module({
  imports: [UserModule, WishlistModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductRepository],
})
export class ProductModule { }
