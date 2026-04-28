import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateGalleryDto } from "./dto/update-gallery.dto";
import { CreateGalleryDto } from "./dto/create-gellery.dto";

@Injectable()
export class GalleryRepo {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateGalleryDto) {
    return this.prisma.gallery.create({
      data,
    });
  }

  findPublished(page?: number, limit?: number) {
    return this.prisma.gallery.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: page && limit ? (page - 1) * limit : undefined,
    });
  }

  findAll(page?: number, limit?: number) {
    return this.prisma.gallery.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: page && limit ? (page - 1) * limit : undefined,
    });
  }

  countAll() {
    return this.prisma.gallery.count();
  }

  findOne(id: string) {
    return this.prisma.gallery.findUnique({
      where: { id },
    });
  }

  update(id: string, data: UpdateGalleryDto) {
    return this.prisma.gallery.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.gallery.delete({
      where: { id },
    });
  }
}
