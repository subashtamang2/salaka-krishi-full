import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { HeroBannerRepository } from "./hero-banner.repository";
import { CreateHeroBannerDto } from "./dto/create-hero-banner.dto";
import { UpdateHeroBannerDto } from "./dto/update-hero-banner.dto";
import { CategoriesService } from "../categories/categories.service";

@Injectable()
export class HeroBannerService {
  constructor(
    private readonly heroBannerRepository: HeroBannerRepository,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createHeroBannerDto: CreateHeroBannerDto) {
    // Verify Category Existence
    await this.categoriesService.findOne(createHeroBannerDto.categoryId);

    const result = await this.heroBannerRepository.create(createHeroBannerDto);
    if (!result) {
      throw new InternalServerErrorException("Hero banner creation failed");
    }
    return result;
  }

  findAll() {
    return this.heroBannerRepository.findAll();
  }

  findActive() {
    return this.heroBannerRepository.findActive();
  }

  async findOne(id: string) {
    const result = await this.heroBannerRepository.findOne(id);
    if (!result) {
      throw new NotFoundException("Hero banner not found");
    }
    return result;
  }

  async update(id: string, updateHeroBannerDto: UpdateHeroBannerDto) {
    const result = await this.heroBannerRepository.update(id, updateHeroBannerDto);
    if (!result) {
      throw new InternalServerErrorException("Hero banner update failed");
    }
    return result;
  }

  async remove(id: string) {
    const result = await this.heroBannerRepository.remove(id);
    if (!result) {
      throw new InternalServerErrorException("Hero banner deletion failed");
    }
    return result;
  }
}
