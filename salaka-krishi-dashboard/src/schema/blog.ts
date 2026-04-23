export interface CreateBlogPayload {
  title: string;
  slug: string;
  imageUrl: string | undefined;
  shortDesc: string;
  content: string;
  isPublished: boolean;
  keywords: string[];
  categoryId: string;
}

export interface BlogInterface extends CreateBlogPayload {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogUpdatePayload extends Omit<CreateBlogPayload, "slug"> {}
