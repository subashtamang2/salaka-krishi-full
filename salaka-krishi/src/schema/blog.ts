export interface BlogInterface {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  content: string;
  imageUrl: string;
  isPublished: boolean;
  keywords: string[];
  _count: {
    comments: number;
  };
  createdAt: string;
  updatedAt: string;
}

