import { Module } from "@nestjs/common";
import { BannersController } from "./banners.controller";
import { BannersService } from "./banners.service";
import { BannerRepository } from "./banner.repo";
import { PrismaModule } from "../../prisma/prisma.module";
import { ProductModule } from "../product/product.module";

@Module({
    imports: [PrismaModule, ProductModule],
    controllers: [BannersController],
    providers: [BannersService, BannerRepository],
})
export class BannersModule { }
