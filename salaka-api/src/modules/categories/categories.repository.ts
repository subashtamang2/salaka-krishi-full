import {
  Injectable,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CATEGORY_STATUS } from "generated/prisma/enums";

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findBySlug(slug: string) {
    return this.prisma.category.findUnique({
      where: { slug },
    });
  }

  create(createCategoryDto: CreateCategoryDto, userId: string) {
    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        userId: userId,
      },
    });
  }

  findAll() {
    return this.prisma.category.findMany({
      where: { status: CATEGORY_STATUS.Active },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            imageUrls: true,
          },
        },
      },
    });
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  remove(id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }

  countProducts(categoryId: string) {
    return this.prisma.product.count({
      where: { categoryId },
    });
  }

  countHeroBanners(categoryId: string) {
    return this.prisma.heroBanner.count({
      where: { categoryId },
    });
  }

  findCategoryByUserId(userId: string) {
    return this.prisma.category.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  filterList() {
    return this.prisma.category.findMany({
      where: { status: CATEGORY_STATUS.Active },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
  }
}
