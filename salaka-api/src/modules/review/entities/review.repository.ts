
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { CreateReviewDto } from "../dto/create-review.dto";
import { UpdateReviewDto } from "../dto/update-review.dto";

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) { }

  createReview(
    createReviewDto: CreateReviewDto,
    userId: string,
    productId: string
  ) {
    return this.prisma.reviews.create({
      data: {
        ...createReviewDto,
        userId: userId,
        productId: productId,
      },
      include: {
        User: true,
      },
    });
  }

  findAllReviews(productId: string, page: number) {
    return this.prisma.$transaction([
      this.prisma.reviews.count({
        where: { productId },
      }),
      this.prisma.reviews.findMany({
        where: { productId },
        take: 4 * page,
        orderBy: { createdAt: "desc" },
        include: {
          User: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileUrl: true,
            },
          },
        },
      }),
    ]);
  }

  findReviewById(id: string, productId: string) {
    return this.prisma.reviews.findUnique({
      where: { id, productId },
      include: {
        User: true,
      },
    });
  }

  findReviewByIdStandalone(id: string) {
    return this.prisma.reviews.findUnique({
      where: { id },
    });
  }

  findByUserAndProduct(userId: string, productId: string) {
    return this.prisma.reviews.findFirst({
      where: { userId, productId },
      select: { id: true },
    });
  }

  updateReview(
    id: string,
    updateReviewDto: UpdateReviewDto,
    productId: string
  ) {
    return this.prisma.reviews.update({
      where: { id, productId },
      data: updateReviewDto,
    });
  }

  deleteReview(id: string, productId: string) {
    return this.prisma.reviews.delete({ where: { id, productId } });
  }

  getReviewInfo(productId: string) {
    return this.prisma.reviews.groupBy({
      by: ["rating"],
      where: { productId },
      _count: {
        rating: true,
      },
      orderBy: { rating: "desc" },
    });
  }

  findReviewsByCategory(
    categoryId: string,
    page: number = 1,
    pageSize: number = 4
  ) {
    return this.prisma.reviews.findMany({
      where: {
        Product: {
          categoryId: categoryId,
        },
      },
      include: {
        User: true,
        Product: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  countReviewsByCategory(categoryId: string) {
    return this.prisma.reviews.count({
      where: {
        Product: {
          categoryId: categoryId,
        },
      },
    });
  }

  findAllGlobal(page: number, limit: number, search?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { Product: { name: { contains: search, mode: "insensitive" } } },
        { User: { firstName: { contains: search, mode: "insensitive" } } },
        { User: { lastName: { contains: search, mode: "insensitive" } } },
        { comment: { contains: search, mode: "insensitive" } },
      ];
    }

    return this.prisma.$transaction([
      this.prisma.reviews.count({ where }),
      this.prisma.reviews.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          User: true,
          Product: true,
        },
      }),
    ]);
  }

  deleteById(id: string) {
    return this.prisma.reviews.delete({
      where: { id },
    });
  }
}
