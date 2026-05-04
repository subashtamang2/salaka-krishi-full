import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { CartStrategy } from "./cart.strategy";

import { ProductModule } from "../product/product.module";
 
@Module({
imports: [PrismaModule, ProductModule],
controllers: [CartController],
providers: [CartService, CartStrategy],
exports: [CartService],
})
export class CartModule {}
