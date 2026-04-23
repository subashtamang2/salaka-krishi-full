export interface ClientReviewInterface {
  name: string;
  imageUrl?: string | null;
  position?: string | null;
  review: string;
}

export interface ClientReviewSchema extends ClientReviewInterface {
  id: string;
  createdAt: string;
  updatedAt: string;
}
