export enum ProductAvailability {
  IN_STOCK = "InStock",
  OUT_OF_STOCK = "OutOfStock",
  PREORDER = "PreOrder",
}

export enum ProductStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export interface CreateProductSchema {
  name: string;
  slug: string;
  description: string;
  price: number;
  rating: number;
  availability: ProductAvailability;
  isBlackFriday: boolean;
  isFeatured: boolean;
  status: ProductStatus;
  stock: number;
  sold: number;
  estimatedDeliveryMinDays: number;
  estimatedDeliveryMaxDays: number;
  discountPercentage?: number | null;
  discountStartDate?: string | null;
  discountEndDate?: string | null;
  tags: string[];
  imageUrls: string[];
  categoryId: string;
  addedBy: string;
}
interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ProductSchema
  extends Omit<CreateProductSchema, "categoryId"> {
  id: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProductSchema
  extends Omit<CreateProductSchema, "slug" | "imageUrls" | "addedBy" | "rating" | "sold"> {
  imageUrls?: string[];
}
