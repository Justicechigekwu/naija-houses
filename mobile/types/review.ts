export type ReviewUserPreview = {
  _id: string;
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
  isBanned?: boolean;
};

export type SellerReply = {
  user?: ReviewUserPreview;
  text: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ReviewComment = {
  _id: string;
  user?: ReviewUserPreview;
  text: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ReviewItem = {
  _id: string;
  rating: number;
  comment: string;
  createdAt?: string;
  reviewer?: ReviewUserPreview;
  seller?: ReviewUserPreview;
  listing?: {
    _id?: string;
    title?: string;
  };
  helpfulCount?: number;
  isHelpfulByCurrentUser?: boolean;
  sellerReply?: SellerReply | null;
  comments?: ReviewComment[];
};

export type ExistingReview = {
  _id: string;
  rating: number;
  comment: string;
};

export type ReviewEligibilityResponse = {
  canReview: boolean;
  alreadyReviewed: boolean;
  buyerMessageCount: number;
  sellerMessageCount: number;
  minimumRequired: number;
  existingReview?: ExistingReview | null;
};

export type ReviewsAverageResponse = {
  averageRating?: number;
  totalReviews?: number;
};