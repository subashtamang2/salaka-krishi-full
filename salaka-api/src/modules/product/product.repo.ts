import { PrismaService } from "src/prisma/prisma.service";
import { CreateProductDto, FilterProductsDto } from "./dto/create-product.dto";
import { Injectable } from "@nestjs/common";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ConfigService } from "@nestjs/config";
import { AVAILABILITY, PRODUCT_STATUS } from "generated/prisma/enums";

@Injectable()
export class ProductRepository {
    private postPerPage: number;
    private postPerPageSec: number;
    constructor(
        private readonly prisma: PrismaService,
        private readonly config: ConfigService
    ) {
        this.postPerPage = this.config.get<number>("pagination.pageSize")!;
        this.postPerPageSec = this.config.get<number>("pagination.pageSizeSm")!;
    }
    findProductBySlug(slug: string) {
        return this.prisma.product.findUnique({
            where: { slug },
        });
    }
    findActiveProductBySlug(slug: string, userId?: string | undefined) {
        return this.prisma.product.findUnique({
            where: { slug, status: PRODUCT_STATUS.Active },
            include: {
                wishlist: userId
                    ? {
                        where: {
                            wishlist: { userId: userId },
                        },
                    }
                    : false,
                reviews: {
                    select: {
                        id: true,
                        rating: true,
                    },
                    take: 1,
                    orderBy: { rating: "desc" },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                _count: {
                    select: {
                        reviews: true,
                    },
                },
            },
        });
    }
    createProduct(productDto: CreateProductDto, userId: string) {
        return this.prisma.product.create({
            data: {
                ...productDto,
                addedBy: userId, // relation, fine as-is
            },
        });
    }
    findCurrentUserProducts(userId: string) {
        return this.prisma.product.findMany({
            where: {
                addedBy: userId,
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    findAll() {
        return this.prisma.product.findMany({
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    findProductById(id: string) {
        return this.prisma.product.findUnique({
            where: {
                id,
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                reviews: {
                    select: {
                        id: true,
                        comment: true,
                        rating: true,
                        createdAt: true,
                    },
                },

                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileUrl: true,
                    },
                },
                _count: {
                    select: {
                        reviews: true,
                    },
                },
            },
        });
    }
    updateProduct(id: string, data: UpdateProductDto) {
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }
    deleteProduct(id: string) {
        return this.prisma.product.delete({
            where: { id },
        });
    }
    findProductByProductIdAndUserId(productId: string, userId: string) {
        return this.prisma.product.findUnique({
            where: {
                id: productId,
                addedBy: userId,
            },
        });
    }
    findFeaturedProducts(wishlistId?: string | null, cartId?: string | null) {
        return this.prisma.product.findMany({
            where: {
                isFeatured: true,
                status: PRODUCT_STATUS.Active,
                availability: AVAILABILITY.InStock,
            },
            include: {
                cart: cartId
                    ? {
                        where: {
                            cartId: cartId,
                        },
                    }
                    : false,
                wishlist: wishlistId
                    ? {
                        where: {
                            wishlistId: wishlistId,
                        },
                    }
                    : false,
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                _count: {
                    select: {
                        reviews: true,
                    },
                },
            },
            take: this.postPerPage,
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    findNewestProduct(wishlistId?: string | null, cartId?: string | null) {
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        last7Days.setHours(0, 0, 0, 0);

        return this.prisma.product.findMany({
            where: {
                status: PRODUCT_STATUS.Active,
                availability: AVAILABILITY.InStock,
                createdAt: { gte: last7Days },
            },
            include: {
                cart: cartId
                    ? {
                        where: {
                            cartId: cartId,
                        },
                    }
                    : false,
                wishlist: wishlistId
                    ? {
                        where: {
                            wishlistId: wishlistId,
                        },
                    }
                    : false,
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                _count: {
                    select: {
                        reviews: true,
                    },
                },
            },
            take: this.postPerPage,
            orderBy: {
                createdAt: "desc",
            },
        });
    }


    findBestSellingProduct(wishlistId?: string | null, cartId?: string | null) {
        return this.prisma.product.findMany({
            where: {
                status: PRODUCT_STATUS.Active,
                availability: { in: [AVAILABILITY.InStock, AVAILABILITY.PreOrder] },
               sold: {
                gte: 35
            },
            },

            include: {
                cart: cartId
                    ? {
                        where: {
                            cartId: cartId,
                        },
                    }
                    : false,
                wishlist: wishlistId
                    ? {
                        where: {
                            wishlistId: wishlistId,
                        },
                    }
                    : false,
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                _count: {
                    select: {
                        reviews: true,
                    },
                },
            },
            take: this.postPerPage,
            orderBy: {
                sold: "desc",
            },
        });
    }


    findTopRatedProduct(wishlistId?: string | null, cartId?: string | null) {
        return this.prisma.product.findMany({
            where: {
                status: PRODUCT_STATUS.Active,
                availability: { in: [AVAILABILITY.InStock, AVAILABILITY.PreOrder] },
                rating: { gte: 4 },
            },
            include: {
                cart: cartId
                    ? {
                        where: {
                            cartId: cartId,
                        },
                    }
                    : false,
                wishlist: wishlistId
                    ? {
                        where: {
                            wishlistId: wishlistId,
                        },
                    }
                    : false,
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                _count: {
                    select: {
                        reviews: true,
                    },
                },
            },
            take: this.postPerPage,
            orderBy: {
                rating: "desc",
            },
        });
    }

    findOnSaleProducts(wishlistId?: string | null, cartId?: string | null) {
        const today = new Date();

        return this.prisma.product.findMany({
            where: {
                status: PRODUCT_STATUS.Active,
                availability: AVAILABILITY.InStock,
                discountPercentage: { gt: 0 },
                discountStartDate: { lte: today },
                discountEndDate: { gte: today },
            },
            include: {
                cart: cartId
                    ? {
                        where: { cartId: cartId },
                    }
                    : false,
                wishlist: wishlistId
                    ? {
                        where: { wishlistId: wishlistId },
                    }
                    : false,
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                _count: {
                    select: {
                        reviews: true,
                    },
                },
            },
            take: this.postPerPage,
            orderBy: {
                discountPercentage: "desc",
            },
        });
    }







    findLimitedStockProducts(wishlistId?: string | null, cartId?: string | null) {
        return this.prisma.product.findMany({
            where: {
                status: PRODUCT_STATUS.Active,
                stock: {
                    lte: 20,
                    gt: 0,
                },
            },
            include: {
                cart: cartId
                    ? {
                        where: {
                            cartId: cartId,
                        },
                    }
                    : false,
                wishlist: wishlistId
                    ? {
                        where: {
                            wishlistId: wishlistId,
                        },
                    }
                    : false,
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                _count: {
                    select: {
                        reviews: true,
                    },
                },
            },
            take: this.postPerPage,
            orderBy: {
                stock: "asc",
            }
        });
    }
    findProducts(
        number?: number,
        wishlistId?: string | null,
        cartId?: string | null
    ) {
        return this.prisma.product.findMany({
            where: {
                status: PRODUCT_STATUS.Active,
                availability: { in: [AVAILABILITY.InStock, AVAILABILITY.PreOrder] },
            },
            take: number ?? this.postPerPage,
            include: {
                cart: cartId
                    ? {
                        where: {
                            cartId: cartId,
                        },
                    }
                    : false,
                wishlist: wishlistId
                    ? {
                        where: {
                            wishlistId: wishlistId,
                        },
                    }
                    : false,
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                _count: {
                    select: {
                        reviews: true,
                    },
                },
            },
            orderBy: {
                sold: "desc",
            },
        });
    }

    async findByQuery(where: any, wishlistId?: string | null, cartId?: string | null, orderBy?: any, skip?: number, take?: number) {
        const count = await this.prisma.product.count({ where });
        const products = await this.prisma.product.findMany({
            where: where,
            include: {
                cart: cartId
                    ? {
                        where: {
                            cartId: cartId,
                        },
                    }
                    : false,
                wishlist: wishlistId
                    ? {
                        where: {
                            wishlistId: wishlistId,
                        },
                    }
                    : false,
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                _count: {
                    select: {
                        reviews: true,
                    },
                },
            },
            orderBy: orderBy || {
                createdAt: "desc",
            },
            skip: skip,
            take: take,
        });

        return { products, count };
    }
}
