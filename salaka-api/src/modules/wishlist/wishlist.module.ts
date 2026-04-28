import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { WishlistController } from "./wishlist.controller";
import { WishlistService } from "./wishlist.service";
import { WishlistRepo } from "./wishlist.repo";

@Module({
imports: [PrismaModule],
controllers: [WishlistController],
providers: [WishlistService, WishlistRepo],
exports: [WishlistRepo],
})
export class WishlistModule {}
