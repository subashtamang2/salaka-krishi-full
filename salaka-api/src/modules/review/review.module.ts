import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { ReviewController, ReviewAdminController, ReviewPublicController } from "./review.controller";
import { ReviewService } from "./review.service";
import { ReviewRepository } from "./entities/review.repository";
import { ProductModule } from "../product/product.module";

@Module({
    imports: [PrismaModule, ProductModule],
    controllers: [ReviewController, ReviewAdminController, ReviewPublicController],
    providers: [ReviewService, ReviewRepository],
})
export class ReviewModule { }
