import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOverallReviewDto } from "./dto/create-overall-review.dto";
import { UpdateOverallReviewDto } from "./dto/update-overall-review.dto";

@Injectable()
export class OverallReviewsHelper {
  constructor(private readonly prisma: PrismaService) {}
  create(createOverallReviewDto: CreateOverallReviewDto, userId: string) {
    return this.prisma.overallReview.create({
      data: {
        ...createOverallReviewDto,
        createedById: userId,
      },
    });
  }
  findAll() {
    return this.prisma.overallReview.findMany({
      orderBy: { createdAt: "desc" },
    });
  }
  findOne(id: string) {
    return this.prisma.overallReview.findUnique({
      where: { id },
    });
  }
  updated(id: string, updateOverallReviewDto: UpdateOverallReviewDto) {
    return this.prisma.overallReview.update({
      where: { id },
      data: updateOverallReviewDto,
    });
  }
  remove(id: string) {
    return this.prisma.overallReview.delete({
      where: { id },
    });
  }
}
