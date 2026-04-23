import { Module } from "@nestjs/common";
import { OverallReviewsController } from "./overall-reviews.controller";
import { OverallReviewsService } from "./overall-reviews.service";
import { OverallReviewsHelper } from "./overall-reviews.helper";

@Module({
controllers: [OverallReviewsController],
providers: [OverallReviewsService, OverallReviewsHelper],
})
export class OverallReviewsModule {}
