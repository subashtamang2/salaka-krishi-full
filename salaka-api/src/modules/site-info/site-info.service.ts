import { Injectable } from "@nestjs/common";
import {
  CreateSiteInfoDto,
  UpsertSocialMediaDto,
} from "./dto/create-site-info.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { instanceToPlain } from "class-transformer";
import { PRODUCT_STATUS, ROLE } from "@prisma/client";

@Injectable()
export class SiteInfoService {
  constructor(private readonly prisma: PrismaService) {}
  async upsertInfo(createSiteInfoDto: CreateSiteInfoDto, userId: string) {
    try {
      return await this.prisma.siteInfo.upsert({
        where: { key: "SITE_INFO" },
        update: {
          name: createSiteInfoDto.name,
          logoUrl: createSiteInfoDto.logoUrl ?? "",
          keywords: createSiteInfoDto.keywords ?? [],
          description: createSiteInfoDto.description ?? "",
          email: createSiteInfoDto.email,
          phone: createSiteInfoDto.phone,
          address: createSiteInfoDto.address,
          updatedById: userId,
        },
        create: {
          key: "SITE_INFO",
          name: createSiteInfoDto.name,
          logoUrl: createSiteInfoDto.logoUrl ?? "",
          keywords: createSiteInfoDto.keywords ?? [],
          description: createSiteInfoDto.description ?? "",
          email: createSiteInfoDto.email,
          phone: createSiteInfoDto.phone,
          address: createSiteInfoDto.address,
          createdBy: userId,
        },
      });
    } catch (error) {
      console.error("❌ SiteInfo upsertInfo detailed error:", JSON.stringify(error, null, 2));
      throw error;
    }
  }


  getSiteInfo() {
    return this.prisma.siteInfo.findUnique({
      where: { key: "SITE_INFO" },
    });
  }
  upsertSocialMedia(
    upsertSocialMediaDto: UpsertSocialMediaDto,
    userId: string
  ) {
    const plainDto = instanceToPlain(upsertSocialMediaDto);

    return this.prisma.siteInfo.upsert({
      where: { key: "SITE_INFO" },
      update: {
        socialMediaLinks: plainDto.socialMediaLinks,
        updatedById: userId,
      },
      create: {
        key: "SITE_INFO",
        name: "", // Required fields must be provided for create
        logoUrl: "",
        keywords: [],
        description: "",
        email: "",
        phone: "",
        socialMediaLinks: plainDto.socialMediaLinks,
        createdBy: userId,
      },
    });

  }

  details() {
    return this.prisma.$transaction([
      this.prisma.product.count({
        where: {
          status: PRODUCT_STATUS.Active,
        },
      }),
      this.prisma.blog.count({
        where: { isPublished: true },
      }),
      this.prisma.user.count({
        where: { role: ROLE.User },
      }),
    ]);
  }

  getSocialMedia() {
    return this.prisma.siteInfo.findUnique({
      where: { key: "SITE_INFO" },
      select: {
        socialMediaLinks: true,
      },
    });
  }
}
