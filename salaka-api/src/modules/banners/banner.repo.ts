import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { UpdateBannerDto } from "./dto/update-banner.dto";
import { BANNER_TAG, PRODUCT_STATUS } from "generated/prisma/enums";

@Injectable()
export class BannerRepository {
    constructor(private readonly prisma: PrismaService) { }

    findBannerBySlug(slug: string) {
        return this.prisma.banner.findUnique({
            where: { slug },
        });
    }


    // Create a banner
    create(createBannerDto: CreateBannerDto, userId: string) {
        return this.prisma.banner.create({
            data: { ...createBannerDto, addedBy: userId },
        });
    }

    // Get all banners
    findAll() {
        return this.prisma.banner.findMany({
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        availability: true
                    }
                }
            },
            orderBy: { createdAt: "desc" },
        });
    }

    // Get active banners, and attach products based on tag or productId
    async findActive(tag?: string) {
        const now = new Date();
        const where: any = {
            isActive: true,
            AND: [
                {
                    OR: [
                        { startDate: { equals: null } },
                        { startDate: { lte: now } },
                    ],
                },
                {
                    OR: [
                        { endDate: { equals: null } },
                        { endDate: { gte: now } },
                    ],
                },
            ],
        };

        if (tag) {
            where.tag = tag as BANNER_TAG;
        }

        const banners = await this.prisma.banner.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });

        // attach products as before...
        for (const banner of banners) {
            if (banner.tag === BANNER_TAG.BestSelling) {
                banner["product"] = await this.prisma.product.findFirst({
                    where: { status: PRODUCT_STATUS.Active },
                    orderBy: { sold: "desc" },
                });
            } else if (banner.tag === BANNER_TAG.LimitedStock) {
                banner["product"] = await this.prisma.product.findFirst({
                    where: { status: PRODUCT_STATUS.Active, stock: { lte: 40 } },
                    orderBy: { stock: "asc" },
                });
            } else if (banner.tag === BANNER_TAG.BlackFriday) {
                banner["product"] = banner.productId
                    ? await this.prisma.product.findUnique({ where: { id: banner.productId } })
                    : await this.prisma.product.findFirst({
                        where: {
                            status: PRODUCT_STATUS.Active,
                            OR: [
                                { isBlackFriday: true },
                                { tags: { has: "BlackFriday" } },
                                { discountPercentage: { gte: 50 } },
                            ],
                        },
                        orderBy: { discountPercentage: "desc" },
                    });
            } else if (banner.tag === BANNER_TAG.NewArrival) {
                banner["product"] = banner.productId
                    ? await this.prisma.product.findUnique({ where: { id: banner.productId } })
                    : await this.prisma.product.findFirst({
                        where: { status: PRODUCT_STATUS.Active },
                        orderBy: { createdAt: "desc" },
                    });



            } else if (banner.productId) {
                banner["product"] = await this.prisma.product.findUnique({
                    where: { id: banner.productId },
                });
            } else {
                banner["product"] = null;
            }
        }

        return banners;
    }

    // Find banner by id
    findOne(id: string) {
        return this.prisma.banner.findUnique({
            where: { id },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        availability: true
                    }
                }
            }
        });
    }

    // Update banner
    update(id: string, updateBannerDto: UpdateBannerDto) {
        return this.prisma.banner.update({
            where: { id },
            data: { ...updateBannerDto },
        });
    }

    // Remove banner
    remove(id: string) {
        return this.prisma.banner.delete({ where: { id } });
    }
}
