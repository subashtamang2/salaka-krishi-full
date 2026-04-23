export enum FaqCategory {
  SHIPPING = "Shipping",
  ORDER = "Order",
  RETURNS = "Returns",
  PRODUCTS = "Products",
}

export interface CreateFaqSchema {
  question: string;
  slug: string;
  answer: string;
  category: FaqCategory;
}

export interface FaqSchema extends CreateFaqSchema {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateFaqSchema extends Omit<CreateFaqSchema, 'slug'> {
}
