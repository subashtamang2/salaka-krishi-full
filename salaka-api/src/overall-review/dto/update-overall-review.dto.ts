import { PartialType } from "@nestjs/swagger";
import { CreateClientReviewDto } from "src/modules/client-reviews/dto/create-client-review.dto";
import { CreateOverallReviewDto } from "./create-overall-review.dto";

export class UpdateOverallReviewDto extends PartialType(CreateOverallReviewDto) {}
