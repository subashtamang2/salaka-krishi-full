import {
    Injectable,
    InternalServerErrorException,
    NotAcceptableException,
    NotFoundException,
} from "@nestjs/common";
import { CreateProductDto, FilterProductsDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductRepository } from "./product.repo";
import { JwtPayload } from "../auth/interface";
import { UserService } from "../user/user.service";
import { Product } from "./entities/product.entity";
import { PRODUCT_FILTER } from "./product.enum";
import { WishlistRepo } from "../wishlist/wishlist.repo";
import { PRODUCT_STATUS, ROLE } from "@prisma/client";

import { CategoriesService } from "../categories/categories.service";
 
@Injectable()
export class ProductService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly userService: UserService,
        private readonly wishlistRepo: WishlistRepo,
        private readonly categoriesService: CategoriesService,
    ) { }

    async create(createProductDto: CreateProductDto, user: JwtPayload) {
        const userId = user.sub;
        const checkSlug = await this.productRepository.findProductBySlug(
            createProductDto.slug
        );
        if (checkSlug)
            throw new NotAcceptableException("Product with this slug already exists");
 
        if (createProductDto.stock !== undefined && createProductDto.stock < 0) {
            throw new NotAcceptableException("Stock cannot be negative");
        }

        // Verify Category Existence
        await this.categoriesService.findOne(createProductDto.categoryId);

        const product = await this.productRepository.createProduct(
            createProductDto,
            userId
        );
        if (!product) {
            throw new InternalServerErrorException("Product creation failed");
        }
        return product;
    }

    async findAll(user: JwtPayload) {
        const role = user?.role;
        const userId = user?.sub;
        if (role === ROLE.SuperAdmin) {
            const products = await this.productRepository.findAll();
            return products;
        }
        const products = await this.productRepository.findCurrentUserProducts(
            userId
        );
        return products;
    }

    async findOne(id: string) {
        const product = await this.productRepository.findProductById(id);
        if (!product) {
            throw new NotFoundException("Product with this id does not exist");
        }
        return product;
    }

    async findProductBySlug(slug: string, user: JwtPayload | undefined) {
        const userId = user?.sub;

        const { wishlistId, cartId } = await this.getCurrentWishlistAndCart(userId);
        const product = await this.productRepository.findActiveProductBySlug(
            slug,
            userId,
            cartId
        );
        if (!product) {
            throw new NotFoundException("Product does not exist");
        }
        const { wishlist, cart, ...rest } = product as any;
        return {
            ...rest,
            isInWishlist: wishlist && wishlist.length > 0,
            isInCart: cart && cart.length > 0,
        };
    }

    async update(
        id: string,
        user: JwtPayload,
        updateProductDto: UpdateProductDto
    ) {
        const userRole = user.role;
        const userId = user.sub;

        if (userRole === ROLE.Admin) {
            const checkProduct =
                await this.productRepository.findProductByProductIdAndUserId(
                    id,
                    userId
                );
            if (!checkProduct) {
                throw new NotFoundException(
                    "Product with this id does not exist for the current user"
                );
            }
        }

        if (userRole === ROLE.SuperAdmin) {
            const checkProduct = await this.productRepository.findProductById(id);
            if (!checkProduct) {
                throw new NotFoundException("Product with this id does not exist");
            }
        }

        if (updateProductDto.stock !== undefined && updateProductDto.stock < 0) {
            throw new NotAcceptableException("Stock cannot be negative");
        }

        const updatedProduct = await this.productRepository.updateProduct(
            id,
            updateProductDto
        );
        if (!updatedProduct) {
            throw new InternalServerErrorException("Product update failed");
        }
        return updatedProduct;
    }

    async remove(id: string, user: JwtPayload) {
        const userRole = user.role;
        const userId = user.sub;

        if (userRole === ROLE.Admin) {
            const checkProduct =
                await this.productRepository.findProductByProductIdAndUserId(
                    id,
                    userId
                );
            if (!checkProduct) {
                throw new NotFoundException(
                    "Product with this id does not exist for the current user"
                );
            }
        }

        const deletedProduct = await this.productRepository.deleteProduct(id);
        if (!deletedProduct) {
            throw new NotFoundException("Product with this id does not exist");
        }
        return deletedProduct;
    }
    async findFeatured(user: JwtPayload | undefined) {
        const userId = user?.sub;
        const { wishlistId, cartId } = await this.getCurrentWishlistAndCart(userId);

        const products = await this.productRepository.findFeaturedProducts(
            wishlistId,
            cartId
        );
        const result = products.map((product) => {
            const { wishlist, ...rest } = product;
            const isInWishlist = wishlist && wishlist.length > 0;
            const isInCart = product.cart && product.cart.length > 0;
            return {
                ...rest,
                isInWishlist: isInWishlist,
                isInCart: isInCart,
            };
        });

        return result;
    }

    async getCurrentWishlistAndCart(userId?: string) {
        if (!userId) {
            return { wishlistId: null, cartId: null };
        }
        try {
            const user = await this.userService.getUniqueUser(userId);
            const wishlistId = user?.Wishlists?.id;
            const cartId = user?.Cart?.id;
            return { wishlistId, cartId };
        } catch (error) {
            return { wishlistId: null, cartId: null };
        }
    }



    async filterProducts(
        filterType: PRODUCT_FILTER,
        user: JwtPayload | undefined,
        number?: number
    ) {
        const { wishlistId, cartId } = await this.getCurrentWishlistAndCart(
            user?.sub
        );
        let products: Product[] | unknown[] = [];
        switch (filterType) {
            case PRODUCT_FILTER.Featured:
                products = await this.productRepository.findFeaturedProducts(
                    wishlistId,
                    cartId
                );
                break;

            case PRODUCT_FILTER.New:
                products = await this.productRepository.findNewestProduct(
                    wishlistId,
                    cartId
                );
                break;

            case PRODUCT_FILTER.BestSelling:
                products = await this.productRepository.findBestSellingProduct(
                    wishlistId,
                    cartId
                );
                break;
            case PRODUCT_FILTER.OnSale:
                products = await this.productRepository.findOnSaleProducts(
                    wishlistId,
                    cartId
                );
                break;

            case PRODUCT_FILTER.TopRated:
                products = await this.productRepository.findTopRatedProduct(
                    wishlistId,
                    cartId
                );
                break;
            case PRODUCT_FILTER.LimitedStock:
                products = await this.productRepository.findLimitedStockProducts(
                    wishlistId,
                    cartId
                );
                break;
            default:
                products = await this.productRepository.findProducts(
                    number,
                    wishlistId,
                    cartId
                );
        }

        const results = products.map((product: Product) => {
            const { wishlist, ...rest } = product;
            const isInWishlist = wishlist && wishlist.length > 0;
            const isInCart = product.cart && product.cart.length > 0;
            return {
                ...rest,
                isInWishlist: isInWishlist,
                isInCart: isInCart,
            };
        });
        return results;
    }


    async findByQuery(filter: FilterProductsDto, user?: JwtPayload) {
        const userId = user?.sub;
        const { wishlistId, cartId } = await this.getCurrentWishlistAndCart(userId);

        const where: any = {
            AND: []
        };

        if (filter.categories?.length) {
            where.AND.push({
                category: {
                    slug: {
                        in: filter.categories,
                        // Prisma 'in' doesn't support 'mode: insensitive' directly on the array,
                        // but we can assume slugs are handled consistently or map them if needed.
                        // For now, we will add an explicit check to handle the common case.
                    },
                },
            });
        }

        if (filter.availability?.length) {
            where.AND.push({ availability: { in: filter.availability } });
        }

        if (filter.status) {
            where.AND.push({ status: filter.status });
        } else {
            where.AND.push({ status: PRODUCT_STATUS.Active });
        }

        if (filter.search) {
            where.AND.push({
                OR: [
                    { name: { contains: filter.search, mode: "insensitive" } },
                    { description: { contains: filter.search, mode: "insensitive" } },
                ],
            });
        }

        // Handle Pagination
        const page = filter.page && filter.page > 0 ? filter.page : 1;
        const limit = filter.limit && filter.limit > 0 ? filter.limit : 50; // Increased default limit
        const skip = (page - 1) * limit;

        const orderBy: any = {};
        if (filter.sortBy) {
            orderBy[filter.sortBy] = filter.sortOrder === 'desc' ? 'desc' : 'asc';
        }
        if (filter.isNewArrival) {
            orderBy.createdAt = "desc";
            const last7Days = new Date();
            last7Days.setDate(last7Days.getDate() - 7);
            last7Days.setHours(0, 0, 0, 0);
            where.AND.push({ createdAt: { gte: last7Days } });
        }

        if (filter.isBestSelling) {
            orderBy.sold = "desc";
            where.AND.push({ sold: { gte: 35 } });
        }

        if (filter.isLimitedStock) {
            where.AND.push({ stock: { lte: 20, gt: 0 } });
        }

        if (filter.isTopRated) {
            where.AND.push({ rating: { gte: 4 } });
            orderBy.rating = "desc";
        }

        if (filter.isFeatured) {
            where.AND.push({ isFeatured: true });
        }

        if (filter.isBlackFriday) {
            where.AND.push({
                OR: [
                    { isBlackFriday: true },
                    { tags: { has: "BlackFriday" } },
                ],
            });
        }

        // Clean up empty AND
        if (where.AND.length === 0) delete where.AND;


        try {
            const { products, count } = await this.productRepository.findByQuery(
                where,
                wishlistId,
                cartId,
                Object.keys(orderBy).length > 0 ? orderBy : null,
                skip,
                limit
            );
            const results = products.map((product: any) => {
                const { wishlist, ...rest } = product;
                const isInWishlist = wishlist && wishlist.length > 0;
                const isInCart = product.cart && product.cart.length > 0;
                return {
                    ...rest,
                    isInWishlist: isInWishlist,
                    isInCart: isInCart,
                };
            });
            
            return {
                products: results,
                totalCount: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            };
        } catch (error: any) {
            throw error;
        }
    }
}
