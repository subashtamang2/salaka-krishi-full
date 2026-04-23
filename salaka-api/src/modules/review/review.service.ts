import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { ReviewRepository } from "./entities/review.repository";
import { CreateReviewDto } from "./dto/create-review.dto";
import { JwtPayload } from "src/modules/auth/interface";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { ProductRepository } from "../product/product.repo";


@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepo: ReviewRepository,
    private readonly productRepo: ProductRepository
  ) { }

  async create(
    createReviewDto: CreateReviewDto,
    user: JwtPayload,
    productId: string
  ) {
    const userId = user?.sub;

    const existing = await this.reviewRepo.findByUserAndProduct(userId, productId);
    if (existing) {
      throw new ConflictException("You have already reviewed this product.");
    }

    const review = await this.reviewRepo.createReview(
      createReviewDto,
      userId,
      productId
    );
    if (!review) throw new NotFoundException("Product not found");
    await this.synchronizeProductRating(productId);
    return review;
  }

  async checkUserReview(userId: string, productId: string): Promise<boolean> {
    const existing = await this.reviewRepo.findByUserAndProduct(userId, productId);
    return !!existing;
  }

  async getReviewInfo(productId: string) {
    const info = await this.reviewRepo.getReviewInfo(productId);
    if (!info || info.length === 0) {
      throw new NotFoundException("No reviews found for this product");
    }
    return info;
  }

  async findAll(productId: string, noOfReviews: string) {
    const page = Number(noOfReviews) || 1;
    const reviews = await this.reviewRepo.findAllReviews(productId, page);
    const [totalReviews, reviewList] = reviews;
    return {
      total_no_of_reviews: totalReviews,
      current_reviews: reviewList.length,
      reviews: reviewList,
    };
  }

  async findOne(id: string, productId: string) {
    const review = await this.reviewRepo.findReviewById(id, productId);
    if (!review) throw new NotFoundException("Review not found");
    return review;
  }

  async update(
    id: string,
    updateReviewDto: UpdateReviewDto,
    productId: string
  ) {
    const review = await this.reviewRepo.updateReview(
      id,
      updateReviewDto,
      productId
    );
    if (!review) throw new NotFoundException("Review not found");
    await this.synchronizeProductRating(productId);
    return review;
  }

  async remove(id: string, productId: string) {
    const review = await this.reviewRepo.deleteReview(id, productId);
    if (!review) throw new NotFoundException("Review not found");
    await this.synchronizeProductRating(productId);
    return review;
  }

  private async synchronizeProductRating(productId: string) {
    const info = await this.reviewRepo.getReviewInfo(productId);
    if (!info || info.length === 0) {
      await this.productRepo.updateProduct(productId, { rating: 0 });
      return;
    }

    let totalRating = 0;
    let totalCount = 0;

    info.forEach((item) => {
      totalRating += item.rating * item._count.rating;
      totalCount += item._count.rating;
    });

    const averageRating = totalCount > 0 ? totalRating / totalCount : 0;
    await this.productRepo.updateProduct(productId, { rating: averageRating });
  }

  async getReviewsByCategory(categoryId: string, page: number) {
    const reviews = await this.reviewRepo.findReviewsByCategory(
      categoryId,
      page
    );

    const totalReviews = await this.reviewRepo.countReviewsByCategory(
      categoryId
    );

    return {
      total_no_of_reviews: totalReviews,
      current_reviews: reviews.length,
      reviews,
    };
  }

  async findAllGlobal(page: number, limit: number, search?: string) {
    const [total, reviews] = await this.reviewRepo.findAllGlobal(page, limit, search);
    return {
      total_no_of_reviews: total,
      reviews: reviews,
    };
  }

  async removeGlobal(id: string) {
    const review = await this.reviewRepo.findReviewByIdStandalone(id);
    if (!review) throw new NotFoundException("Review not found");
    
    await this.reviewRepo.deleteById(id);
    await this.synchronizeProductRating(review.productId);
    return review;
  }
}
