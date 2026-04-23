
export type ProductCategory = "fruits" | "vegetables"|"seasonalVegetables" | "dairy" | "vermicompost" | "milk" | "khuwa";
export interface ProductListCategorySchema {
  id: number;
  title: string;
  price: number;
  discountPercentage?: number;
  imageUrl: string;
  slug: string;
  isTopRated?: boolean;
  isBestSelling?: boolean;
  isOnSale?: boolean;
  category: ProductCategory;
}
