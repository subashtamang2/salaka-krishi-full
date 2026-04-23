export interface OverallReviewSchema {
  id: string;
  name: string;
  email: string;
  review: string;
  rating: number;
  imageUrl?: string;
  createedById: string;
  createdAt: string;
  updatedAt: string;
}
