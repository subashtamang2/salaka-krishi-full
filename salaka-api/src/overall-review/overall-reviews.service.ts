import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { OverallReviewsHelper } from "./overall-reviews.helper";
import { CreateOverallReviewDto } from "./dto/create-overall-review.dto";
import { JwtPayload } from "src/modules/auth/interface";
import { UpdateOverallReviewDto } from "./dto/update-overall-review.dto";

@Injectable()
export class OverallReviewsService {
  constructor(private readonly overallReviewsHelper: OverallReviewsHelper) {}
  async create(createOverallReviewDto: CreateOverallReviewDto, user: JwtPayload) {
    const userId = user.sub;
    const restult = await this.overallReviewsHelper.create(
      createOverallReviewDto,
      userId
    );
    if (!restult)
      throw new InternalServerErrorException("Failed to create client review");
    return restult;
  }

  async findAll() {
    const result = await this.overallReviewsHelper.findAll();
    if (!result || result.length === 0)
      throw new NotFoundException("Overall  reviews not found");
    return result;
  }

  async findOne(id: string) {
    const result = await this.overallReviewsHelper.findOne(id);
    if (!result)
      throw new NotFoundException(
        `Failed to fetch overall review with id ${id}`
      );
    return result;
  }

  async update(id: string, updateOveralltReviewDto: UpdateOverallReviewDto) {
    const checkReview = await this.overallReviewsHelper.findOne(id);
    if (!checkReview)
      throw new NotFoundException(`Overall  review with id ${id} not found`);
    // Update logic to be implemented
    const result = await this.overallReviewsHelper.updated(
      id,
      updateOveralltReviewDto
    );
    if (!result)
      throw new InternalServerErrorException(
        `Failed to update overall review with id ${id}`
      );
    return result;
  }

  async remove(id: string) {
    const checkReview = await this.overallReviewsHelper.findOne(id);
    if (!checkReview)
      throw new NotFoundException(`Client review with id ${id} not found`);

    const result = await this.overallReviewsHelper.remove(id);
    if (!result)
      throw new InternalServerErrorException(
        `Failed to delete overall review with id ${id}`
      );
    return result;
  }
}
