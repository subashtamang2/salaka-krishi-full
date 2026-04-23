export interface CreateMainBannerPayload {
  title: string;
  tagLine?: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  categoryId: string;
}

export interface MainBannerInterface extends CreateMainBannerPayload {
  id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
