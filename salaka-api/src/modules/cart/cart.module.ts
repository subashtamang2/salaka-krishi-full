import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { CartStrategy } from "./cart.strategy";

@Module({
imports: [PrismaModule],
controllers: [CartController],
providers: [CartService, CartStrategy],
exports: [CartService],
})
export class CartModule {}
