import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
} from "@nestjs/common";
import { HeroBannerService } from "./hero-banner.service";
import { CreateHeroBannerDto } from "./dto/create-hero-banner.dto";
import { UpdateHeroBannerDto } from "./dto/update-hero-banner.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorators";
import { ROLE } from "generated/prisma/enums";
import { Serializer } from "src/interceptors/serializer.interceptor";
import { HeroBanner } from "./entities/hero-banner.entity";

@Controller("hero-banner")
@Serializer(HeroBanner)
export class HeroBannerController {
  constructor(private readonly heroBannerService: HeroBannerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  async create(@Body() createHeroBannerDto: CreateHeroBannerDto) {
    const result = await this.heroBannerService.create(createHeroBannerDto);
    return {
      message: "Hero banner created successfully",
      data: result,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  async findAll() {
    const result = await this.heroBannerService.findAll();
    return {
      message: "Hero banners retrieved successfully",
      data: result,
    };
  }

  @Get("active")
  async findActive() {
    const result = await this.heroBannerService.findActive();
    return {
      message: "Active hero banners retrieved successfully",
      data: result,
    };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const result = await this.heroBannerService.findOne(id);
    return {
      message: "Hero banner retrieved successfully",
      data: result,
    };
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  async update(
    @Param("id") id: string,
    @Body() updateHeroBannerDto: UpdateHeroBannerDto
  ) {
    const result = await this.heroBannerService.update(id, updateHeroBannerDto);
    return {
      message: "Hero banner updated successfully",
      data: result,
    };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  async remove(@Param("id") id: string) {
    const result = await this.heroBannerService.remove(id);
    return {
      message: "Hero banner removed successfully",
      data: result,
    };
  }
}
