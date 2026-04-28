import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
  Req,
  InternalServerErrorException,
  Put,
  NotFoundException,
} from "@nestjs/common";
import { SiteInfoService } from "./site-info.service";
import {
  CreateSiteInfoDto,
  UpsertSocialMediaDto,
} from "./dto/create-site-info.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";


import { JwtPayload } from "../auth/interface";
import { Serializer } from "../../interceptors/serializer.interceptor";
import { SiteInfo, Socialmedia } from "./entities/site-info.entity";
import { ROLE } from "@prisma/client";
import { Roles } from "../auth/decorators/roles.decorators";

@Controller("site-info")
export class SiteInfoController {
  constructor(private readonly siteInfoService: SiteInfoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  @Serializer(SiteInfo)
  async create(
    @Body() createSiteInfoDto: CreateSiteInfoDto,
    @Req() { user }: { user: JwtPayload }
  ) {
    const userId = user.sub;
    const result = await this.siteInfoService.upsertInfo(
      createSiteInfoDto,
      userId
    );
    if (!result)
      throw new InternalServerErrorException(
        "Failed to update site information"
      );
    return {
      message: "Site information updated successfully",
      data: result,
    };
  }

  @Get("details")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const [productCount, blogCount, userCount] =
      await this.siteInfoService.details();

    return {
      message: "Site information fetched successfully",
      data: {
        products: productCount || 0,
        blogs: blogCount || 0,
        users: userCount || 0,
      },
    };
  }

  @Put("social-media")
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Serializer(Socialmedia)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  async upsertSocialMedia(
    @Body() upsertSocialMediaDto: UpsertSocialMediaDto,
    @Req() { user }: { user: JwtPayload }
  ) {
    const userId = user.sub;
    const result = await this.siteInfoService.upsertSocialMedia(
      upsertSocialMediaDto,
      userId
    );
    if (!result)
      throw new InternalServerErrorException(
        "Failed to update social media links"
      );
    return {
      message: "Socialmedia links updated successfully",
      data: result,
    };
  }

  @Get("social-media")
  @HttpCode(HttpStatus.OK)
  @Serializer(Socialmedia)
  async getSocialMedia() {
    const result = await this.siteInfoService.getSocialMedia();
    if (!result) throw new NotFoundException("social media links not found");
    return {
      message: "Social media links fetched successfully",
      data: result,
    };
  }
  @Get()
  @Serializer(SiteInfo)
  @HttpCode(HttpStatus.OK)
  async getSiteInfo() {
    const result = await this.siteInfoService.getSiteInfo();
    return {
      message: "Site information fetched successfully",
      data: result,
    };
  }
}
