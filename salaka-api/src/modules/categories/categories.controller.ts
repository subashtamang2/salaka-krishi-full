import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
  Query,
  NotFoundException,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Serializer } from "src/interceptors/serializer.interceptor";
import { Category } from "./entities/category.entity";
import { RolesGuard } from "../auth/guards/roles.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { JwtPayload } from "../auth/interface";
import { ROLE } from "generated/prisma/enums";
import { Roles } from "../auth/decorators/roles.decorators";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Serializer(Category)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: Request & { user: JwtPayload },
    @Body() createCategoryDto: CreateCategoryDto
  ) {
    const userId = req.user.sub;
    const category = await this.categoriesService.create(
      createCategoryDto,
      userId
    );
    return {
      message: "Category created successfully",
      data: category,
    };
  }
  @Get("filter-list")
  @Serializer(Category)
  @HttpCode(HttpStatus.OK)
  async filterList() {
    const categories = await this.categoriesService.filterList();
    return {
      message: "Filter list retrieved successfully",
      data: categories,
    };
  }

  @Get()
  @Serializer(Category)
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return {
      message: "Categories retrieved successfully",
      data: categories,
    };
  }
  @Get("current-user")
  @Serializer(Category)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  @HttpCode(HttpStatus.OK)
  async findCurrentUserCategories(@Req() req: Request & { user: JwtPayload }) {
    const categories = await this.categoriesService.findByUser(req.user);
    return {
      message: "User's categories retrieved successfully",
      data: categories,
    };
  }

  @Get(":id")
  @Serializer(Category)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param("id") id: string) {
    const data = await this.categoriesService.findOne(id);
    return {
      message: `Category retrieved successfully`,
      data,
    };
  }

  @Patch(":id")
  @Serializer(Category)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    const updatedCategory = await this.categoriesService.update(
      id,
      updateCategoryDto
    );
    return {
      message: `Category updated successfully`,
      data: updatedCategory,
    };
  }

  @Delete(":id")
  @Serializer(Category)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  async remove(@Param("id") id: string) {
    const category = await this.categoriesService.remove(id);
    return {
      message: `Category removed successfully`,
      data: category,
    };
  }
}
