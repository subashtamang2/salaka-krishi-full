export interface ReviewSchema {
  id: string;
  comment: string;
  rating: number;
  User: {
    id: string;
    firstName: string;
    lastName: string;
    profileUrl?: string;
    isGoogleLogin: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface reviewInfoSchema {
  _count: {
    rating: number;
  };
  rating: number;
}


export interface ClientReviews {
  id: string;
  name: string;
  review: string;
  position: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface OverallReviewSchema {
  id: string;
  name: string;
  email: string;
  review: string;
  rating: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
