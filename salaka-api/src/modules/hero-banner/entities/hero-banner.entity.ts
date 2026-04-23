import { Expose, Type } from "class-transformer";

class HeroBannerCategory {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  slug: string;
}

export class HeroBanner {
  @Expose()
  id: string;

  @Expose()
  tagLine?: string;

  @Expose()
  title: string;

  @Expose()
  imageUrl: string;

  @Expose()
  order: number;

  @Expose()
  isActive: boolean;

  @Expose()
  categoryId: string;

  @Expose()
  @Type(() => HeroBannerCategory)
  category: HeroBannerCategory;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
