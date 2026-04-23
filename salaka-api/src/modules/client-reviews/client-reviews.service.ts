import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateClientReviewDto } from "./dto/create-client-review.dto";
import { UpdateClientReviewDto } from "./dto/update-client-review.dto";
import { JwtPayload } from "../auth/interface";
import { ClientReviewsHelper } from "./client-reviews.helper";

@Injectable()
export class ClientReviewsService {
  constructor(private readonly clientReviewsHelper: ClientReviewsHelper) {}
  async create(createClientReviewDto: CreateClientReviewDto, user: JwtPayload) {
    const userId = user.sub;
    const restult = await this.clientReviewsHelper.create(
      createClientReviewDto,
      userId
    );
    if (!restult)
      throw new InternalServerErrorException("Failed to create client review");
    return restult;
  }

  async findAll() {
    const result = await this.clientReviewsHelper.findAll();
    if (!result || result.length === 0)
      throw new NotFoundException("Client reviews not found");
    return result;
  }

  async findOne(id: string) {
    const result = await this.clientReviewsHelper.findOne(id);
    if (!result)
      throw new NotFoundException(
        `Failed to fetch client review with id ${id}`
      );
    return result;
  }

  async update(id: string, updateClientReviewDto: UpdateClientReviewDto) {
    const checkReview = await this.clientReviewsHelper.findOne(id);
    if (!checkReview)
      throw new NotFoundException(`Client review with id ${id} not found`);
    // Update logic to be implemented
    const result = await this.clientReviewsHelper.updated(
      id,
      updateClientReviewDto
    );
    if (!result)
      throw new InternalServerErrorException(
        `Failed to update client review with id ${id}`
      );
    return result;
  }

  async remove(id: string) {
    const checkReview = await this.clientReviewsHelper.findOne(id);
    if (!checkReview)
      throw new NotFoundException(`Client review with id ${id} not found`);

    const result = await this.clientReviewsHelper.remove(id);
    if (!result)
      throw new InternalServerErrorException(
        `Failed to delete client review with id ${id}`
      );
    return result;
  }
}
