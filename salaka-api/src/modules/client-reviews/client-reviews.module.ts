import { Module } from "@nestjs/common";
import { ClientReviewsController } from "./client-reviews.controller";
import { ClientReviewsService } from "./client-reviews.service";
import { ClientReviewsHelper } from "./client-reviews.helper";

@Module({
controllers: [ClientReviewsController],
providers: [ClientReviewsService, ClientReviewsHelper],
})
export class ClientReviewsModule {}
