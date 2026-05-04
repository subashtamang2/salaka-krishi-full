export interface CreateOverallReviewInterface {
    review: string;
    rating: number;
    name: string;
    email: string;
}

export interface OverallReviewInterface extends CreateOverallReviewInterface {
    id: string;
    createdById: string;
    createdAt: string;
    updatedAt: string;
}
