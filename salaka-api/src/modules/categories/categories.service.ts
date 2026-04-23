import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CategoriesRepository } from "./categories.repository";
import { JwtPayload } from "../auth/interface";

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(createCategoryDto: CreateCategoryDto, userId: string) {
    const checkSlug = await this.categoriesRepository.findBySlug(
      createCategoryDto.slug
    );
    if (checkSlug) throw new NotAcceptableException("Slug already exists");

    const category = await this.categoriesRepository.create(
      createCategoryDto,
      userId
    );
    if (!category) {
      throw new NotFoundException("Category could not be created");
    }
    return category;
  }

  async findAll() {
    const categories = await this.categoriesRepository.findAll();
    if (!categories || categories.length === 0) {
      return [];
    }
    return categories;
  }

  async findByUser(user: JwtPayload) {
    const categories = await this.categoriesRepository.findCategoryByUserId(
      user.sub
    );
    if (!categories) {
      return [];
    }
    return categories;
  }

  async findOne(id: string) {
    const category = await this.categoriesRepository.findOne(id);
    if (!category) {
      throw new NotFoundException(`Category not found`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    if (updateCategoryDto.slug) {
      const existingCategory = await this.categoriesRepository.findBySlug(
        updateCategoryDto.slug
      );
      if (existingCategory && existingCategory.id !== id) {
        throw new NotAcceptableException("Slug already exists");
      }
    }
    const updatedCategory = await this.categoriesRepository.update(
      id,
      updateCategoryDto
    );
    if (!updatedCategory) {
      throw new NotFoundException("Category not found");
    }
    return updatedCategory;
  }

  async remove(id: string) {
    const category = await this.categoriesRepository.findOne(id);
    if (!category) {
      throw new NotFoundException("Category not found");
    }

    // Check for related products
    const productCount = await this.categoriesRepository.countProducts(id);
    if (productCount > 0) {
      throw new NotAcceptableException(
        `Cannot delete category. It has ${productCount} product(s) linked to it. Remove or reassign them first.`
      );
    }

    // Check for related hero banners
    const bannerCount = await this.categoriesRepository.countHeroBanners(id);
    if (bannerCount > 0) {
      throw new NotAcceptableException(
        `Cannot delete category. It has ${bannerCount} hero banner(s) linked to it. Remove or reassign them first.`
      );
    }

    return this.categoriesRepository.remove(id);
  }


  async filterList() {
    const categories = await this.categoriesRepository.filterList();
    if (!categories || categories.length === 0) {
      return [];
    }
    return categories;
  }
}
