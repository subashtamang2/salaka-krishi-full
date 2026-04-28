import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { GalleryService } from "./gallery.service";
import { UpdateGalleryDto } from "./dto/update-gallery.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorators";
import { ROLE } from "@prisma/client";
import { CreateGalleryDto } from "./dto/create-gellery.dto";

@Controller("gallery")
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateGalleryDto) {
    const data = await this.galleryService.create(dto);
    return {
      message: "Gallery image added successfully",
      data,
    };
  }

  @Get("/published")
  async findPublished(
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    const data = await this.galleryService.findPublished(
      Number(page),
      Number(limit)
    );
    return {
      message: "Gallery images fetched successfully",
      data,
    };
  }

  @Get()
  async findAll(
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    const result = await this.galleryService.findAll(
      Number(page) || undefined,
      Number(limit) || undefined
    );
    return {
      message: "All gallery images fetched successfully",
      data: result.data,
      total: result.total,
    };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const data = await this.galleryService.findOne(id);
    return {
      message: "Gallery image fetched successfully",
      data,
    };
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  async update(@Param("id") id: string, @Body() dto: UpdateGalleryDto) {
    const data = await this.galleryService.update(id, dto);
    return {
      message: "Gallery image updated successfully",
      data,
    };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  async remove(@Param("id") id: string) {
    const data = await this.galleryService.remove(id);
    return {
      message: "Gallery image deleted successfully",
      data,
    };
  }
}
