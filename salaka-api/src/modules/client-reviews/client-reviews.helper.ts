import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateClientReviewDto } from "./dto/create-client-review.dto";
import { UpdateClientReviewDto } from "./dto/update-client-review.dto";

@Injectable()
export class ClientReviewsHelper {
  constructor(private readonly prisma: PrismaService) {}
  create(createClientReviewDto: CreateClientReviewDto, userId: string) {
    return this.prisma.clientReview.create({
      data: {
        ...createClientReviewDto,
        createedById: userId,
      },
    });
  }
  findAll() {
    return this.prisma.clientReview.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        createedBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });
  }
  findOne(id: string) {
    return this.prisma.clientReview.findUnique({
      where: { id },
    });
  }
  updated(id: string, updateClientReviewDto: UpdateClientReviewDto) {
    return this.prisma.clientReview.update({
      where: { id },
      data: updateClientReviewDto,
    });
  }
  remove(id: string) {
    return this.prisma.clientReview.delete({
      where: { id },
    });
  }
}
