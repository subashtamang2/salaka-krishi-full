import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { GalleryRepo } from "./gallery.repo";
import { UpdateGalleryDto } from "./dto/update-gallery.dto";
import { CreateGalleryDto } from "./dto/create-gellery.dto";

@Injectable()
export class GalleryService {
  constructor(private readonly galleryRepo: GalleryRepo) {}

  async create(dto: CreateGalleryDto) {
    const data = await this.galleryRepo.create(dto);
    if (!data) throw new BadRequestException("Failed to create gallery image");
    return data;
  }

  async findPublished(page?: number, limit?: number) {
    const data = await this.galleryRepo.findPublished(page, limit);
    if (!data.length)
      throw new NotFoundException("No gallery images found");
    return data;
  }

  async findAll(page?: number, limit?: number) {
    const [data, total] = await Promise.all([
      this.galleryRepo.findAll(page, limit),
      this.galleryRepo.countAll(),
    ]);
    return { data, total };
  }

  async findOne(id: string) {
    const data = await this.galleryRepo.findOne(id);
    if (!data) throw new NotFoundException("Gallery image not found");
    return data;
  }

  async update(id: string, dto: UpdateGalleryDto) {
    const data = await this.galleryRepo.update(id, dto);
    if (!data) throw new NotFoundException("Gallery image not found");
    return data;
  }

  async remove(id: string) {
    const data = await this.galleryRepo.remove(id);
    if (!data) throw new NotFoundException("Gallery image not found");
    return data;
  }
}
