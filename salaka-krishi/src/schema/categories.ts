export interface CategorySchema {
  id: string;
  name: string;
  imageUrl: string;
  slug: string;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
  _count: {
    products: number;
  };
}
