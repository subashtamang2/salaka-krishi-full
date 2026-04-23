import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import { ReviewService } from "./review.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { ROLE } from "generated/prisma/enums";
import { Roles } from "../auth/decorators/roles.decorators";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { Serializer } from "src/interceptors/serializer.interceptor";
import { ReviewPaginationResponseDto } from "./entities/review.entity";
import { ReviewAdminQueryDto } from "./dto/review-admin-query.dto";

@ApiTags("Review Management")
@ApiBearerAuth()
@Controller("reviews-admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLE.Admin, ROLE.SuperAdmin)
export class ReviewAdminController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @Serializer(ReviewPaginationResponseDto)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all reviews (Admin)" })
  async findAll(@Query() query: ReviewAdminQueryDto) {
    const { page, limit } = query;
    const result = await this.reviewService.findAllGlobal(Number(page), Number(limit));
    return {
      message: "All reviews fetched successfully",
      data: result,
    };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete a review (Admin)" })
  async remove(@Param("id") id: string) {
    const review = await this.reviewService.removeGlobal(id);
    return {
      message: "Review deleted successfully",
      data: review,
    };
  }
}
