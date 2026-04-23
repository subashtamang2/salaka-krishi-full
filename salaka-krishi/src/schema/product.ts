export type ProductCategory = "fruits" | "vegetables" | "seasonalVegetables" | "dairy" | "vermicompost" | "milk" | "khuwa";
export type ProductType = "Newest" | "OnSale" | "LimitedStock" | "Featured";
export type ProductAvailability = "InStock" | "OutOfStock" | "PreOrder";
export type ProductFilter =
    | "all"
    | "new"
    | "featured"
    | "limited_stock"
    | "top_rated"
    | "best_selling"
    | "on_sale";


export interface ProductSchema {
    id: string;
    name?: string;
    title?: string; // Add title for compatibility with some items
    slug: string;
    category?: ProductCategory;
    imageUrl?: string;
    description?: string;
    price: number;
    imageUrls?: string[];
    rating?: number | null;
    availability?: ProductAvailability;
    isSpecial?: boolean;
    isFeatured?: boolean;
    isNew?: boolean; // Add isNew for compatibility
    isAvailable?: boolean; // Add isAvailable for compatibility
    isInWishlist?: boolean;
    isLimitedStock?: boolean;
    isInCart?: boolean;
    stock?: number;
    sold?: number;
    size?: string[];
    discountPercentage?: number;
    discountPrice?: number; // Add discountPrice for compatibility
    discountStartDate?: string;
    discountEndDate?: string;
    estimatedDeliveryMinDays?: number;
    estimatedDeliveryMaxDays?: number;
    tags?: string[];
    status?: "Active" | "Inactive";
    createdAt?: string;
    updatedAt?: string;
    reviews?: {
        id: string;
        rating: number;
    };
    _count?: {
        reviews: number;
    };
}
