export interface OfferBannerInterface {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  buttonLink?: string;
  productId?: string;
  tag?: string;
  startDate: string | Date | null;
  endDate: string | Date | null;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateOfferBannerSchema {
  title: string;
  slug: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  buttonLink?: string;
  productId?: string;
  tag?: string;
  startDate: string | Date | null;
  endDate: string | Date | null;
  isActive: boolean;
}

export interface UpdateOfferBannerSchema extends Partial<CreateOfferBannerSchema> { }
