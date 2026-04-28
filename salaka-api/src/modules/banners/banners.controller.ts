import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
  HttpStatus,
  HttpCode,
  UseGuards,
  Req,
  NotFoundException,
  Query,
} from "@nestjs/common";
import { BannersService } from "./banners.service";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { UpdateBannerDto } from "./dto/update-banner.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { JwtPayload } from "../auth/interface";
import { Serializer } from "../../interceptors/serializer.interceptor";
import { Banner } from "./entities/banner.entity";
import { Roles } from "../auth/decorators/roles.decorators";
import { BANNER_TAG, ROLE } from "@prisma/client";

@Controller("banners")
@Serializer(Banner)
export class BannersController {
  constructor(private readonly bannersService: BannersService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  async create(
    @Body() createBannerDto: CreateBannerDto,
    @Req() { user }: { user: JwtPayload }
  ) {
    const userId = user.sub;
    const result = await this.bannersService.create(createBannerDto, userId);
    if (!result) {
      throw new InternalServerErrorException("Banner creation failed");
    }
    return {
      message: "Banner created successfully",
      data: result,
    };
  }


  @Get("/active")
  @HttpCode(HttpStatus.OK)
  async findActiveBanner(@Query('tag') tag?: string) {

    const validTag = Object.values(BANNER_TAG).includes(tag as BANNER_TAG)
      ? (tag as BANNER_TAG)
      : undefined;

    const result = await this.bannersService.findActive(validTag);

    if (!result.length) {
      throw new NotFoundException("No banners found");
    }

    return {
      message: "Banners retrieved successfully",
      data: result,
    };
  }


  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  async findAll() {
    const result = await this.bannersService.findAll();
    if (!result.length) {
      throw new NotFoundException("No banners found");
    }
    return {
      message: "Banners retrieved successfully",
      data: result,
    };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const result = await this.bannersService.findOne(id);
    if (!result) {
      throw new NotFoundException("Banner not found");
    }
    return {
      message: "Banner retrieved successfully",
      data: result,
    };
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateBannerDto: UpdateBannerDto
  ) {
    const checkBanner = await this.bannersService.findOne(id);
    if (!checkBanner) {
      throw new NotFoundException("Banner not found");
    }

    const result = await this.bannersService.update(id, updateBannerDto);
    if (!result) {
      throw new InternalServerErrorException("Not able to update banner");
    }
    return {
      message: "Banner updated successfully",
      data: result,
    };
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    const checkBanner = await this.bannersService.findOne(id);
    if (!checkBanner) {
      throw new NotFoundException("Banner not found");
    }
    const result = await this.bannersService.remove(id);
    if (!result) {
      throw new InternalServerErrorException("Not able to remove banner");
    }
    return {
      message: "Banner removed successfully",
      data: result,
    };
  }
}
