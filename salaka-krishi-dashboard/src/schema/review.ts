export interface ReviewUser {
  id: string;
  firstName: string;
  lastName: string;
  profileUrl: string;
  isGoogleLogin: boolean;
}

export interface ReviewProduct {
  id: string;
  name: string;
  slug: string;
}

export interface ReviewSchema {
  id: string;
  comment: string;
  rating: number;
  User: ReviewUser;
  Product: ReviewProduct;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewPaginationSchema {
  total_no_of_reviews: number;
  current_reviews: number;
  reviews: ReviewSchema[];
}
