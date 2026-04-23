import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
  Query,
} from "@nestjs/common";
import { ReviewService } from "./review.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";
import { JwtPayload } from "../auth/interface";
import { Serializer } from "src/interceptors/serializer.interceptor";
import { RolesGuard } from "../auth/guards/roles.guard";
import {
  ReviewPaginationResponseDto,
  ReviewResponseDto,
} from "./entities/review.entity";
import { plainToInstance } from "class-transformer";
import { ROLE } from "generated/prisma/enums";
import { Roles } from "../auth/decorators/roles.decorators";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { ReviewAdminQueryDto } from "./dto/review-admin-query.dto";

@Controller(":productId/review")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.User)
  @Serializer(ReviewResponseDto)
  async create(
    @Param("productId") productId: string,
    @Req() req: Request & { user: JwtPayload },
    @Body() createReviewDto: CreateReviewDto
  ) {
    const user = req?.user;

    const data = await this.reviewService.create(
      createReviewDto,
      user,
      productId
    );
    return {
      message: "Review created successfully",
      data: data,
    };
  }

  @Get("check")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async checkUserReview(
    @Param("productId") productId: string,
    @Req() req: Request & { user: JwtPayload }
  ) {
    const hasReviewed = await this.reviewService.checkUserReview(
      req.user.sub,
      productId
    );
    return {
      message: "Review check successful",
      data: { hasReviewed },
    };
  }

  @Get("info")
  @HttpCode(HttpStatus.OK)
  async getReviewInfo(@Param("productId") productId: string) {
    const info = await this.reviewService.getReviewInfo(productId);
    return {
      message: "Review info fetched successfully",
      data: info,
    };
  }
  @Get()
  @Serializer(ReviewPaginationResponseDto)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param("productId") productId: string,
    @Query("noOfReviews") noOfReviews: string
  ) {
    const review = await this.reviewService.findAll(productId, noOfReviews);
    return {
      message: "All reviews fetched successfully",
      data: review,
    };
  }

  @Get(":id")
  @Serializer(ReviewResponseDto)
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param("productId") productId: string,
    @Param("id") id: string
  ) {
    const review = await this.reviewService.findOne(id, productId);
    return {
      message: `Review fetched successfully`,
      data: review,
    };
  }

  @Patch(":id")
  @Serializer(ReviewResponseDto)
  @HttpCode(HttpStatus.OK)
  update(
    @Param("productId") productId: string,
    @Param("id") id: string,
    @Body() updateReviewDto: UpdateReviewDto
  ) {
    const review = this.reviewService.update(id, updateReviewDto, productId);
    return {
      message: `Review updated successfully`,
      data: review,
    };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async remove(@Param("id") id: string, @Param("productId") productId: string) {
    const review = await this.reviewService.remove(id, productId);
    return {
      message: `Review deleted successfully`,
      data: review,
    };
  }
}

@ApiTags("Review Management")
@ApiBearerAuth()
@Controller("admin-reviews")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLE.Admin, ROLE.SuperAdmin)
export class ReviewAdminController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all reviews (Admin)" })
  async findAll(@Query() query: ReviewAdminQueryDto) {
    const { page, limit, search } = query;
    const result = await this.reviewService.findAllGlobal(
      Number(page),
      Number(limit),
      search
    );

    const serializedResult = plainToInstance(ReviewPaginationResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return {
      message: "All reviews fetched successfully",
      data: serializedResult,
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
