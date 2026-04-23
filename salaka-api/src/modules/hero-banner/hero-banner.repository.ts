import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateHeroBannerDto } from "./dto/create-hero-banner.dto";
import { UpdateHeroBannerDto } from "./dto/update-hero-banner.dto";

@Injectable()
export class HeroBannerRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createHeroBannerDto: CreateHeroBannerDto) {
    return this.prisma.heroBanner.create({
      data: {
        ...createHeroBannerDto,
      },
    });
  }

  findAll() {
    return this.prisma.heroBanner.findMany({
      orderBy: { order: "asc" },
    });
  }

  findActive() {
    return this.prisma.heroBanner.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.heroBanner.findUnique({
      where: { id },
    });
  }

  update(id: string, updateHeroBannerDto: UpdateHeroBannerDto) {
    return this.prisma.heroBanner.update({
      where: { id },
      data: {
        ...updateHeroBannerDto,
      },
    });
  }

  remove(id: string) {
    return this.prisma.heroBanner.delete({
      where: { id },
    });
  }
}
