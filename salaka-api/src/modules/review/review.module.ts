import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { ReviewController, ReviewAdminController } from "./review.controller";
import { ReviewService } from "./review.service";
import { ReviewRepository } from "./entities/review.repository";
import { ProductModule } from "../product/product.module";

@Module({
    imports: [PrismaModule, ProductModule],
    controllers: [ReviewController, ReviewAdminController],
    providers: [ReviewService, ReviewRepository],
})
export class ReviewModule { }
