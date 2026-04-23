export enum CategoryStatus {
  Active = "Active",
  Inactive = "Inactive",
}

export interface Category {
  name: string;
  slug: string;
  status: CategoryStatus;
  imageUrl?: string;
}

export interface CategoryResponse extends Category {
  id: string;

  createdAt: string;
  updatedAt: string;
}

export interface CategoryUpdate extends Omit<Category, "slug"> {}
