export type PublishStatus =
  | "DRAFT"
  | "AWAITING_PAYMENT"
  | "PENDING_CONFIRMATION"
  | "PUBLISHED"
  | "EXPIRED"
  | "REJECTED"
  | "REMOVED_BY_ADMIN"
  | "APPEAL_PENDING";

export type PublishPlan = "TRIAL_14_DAYS" | "PAID_30_DAYS" | null;

export type Listing = {
  _id: string;
  title?: string;
  description?: string;
  category?: string;
  subcategory?: string;
  price?: number;
  state?: string;
  location?: string;
  city?: string;
  images?: { url: string; public_id?: string }[];
  publishStatus?: PublishStatus;
  publishPlan?: PublishPlan;
  publishedAt?: string | null;
  expiresAt?: string | null;
  listingType?: "Sale" | "Rent";
  expiredAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  postedBy?: "Owner" | "Agent" | "Dealer" | "Seller";
  distanceMeters?: number;
  owner?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
};

export type PaginatedListingsResponse = {
  items?: Listing[];
  listings?: Listing[];
  similarListings?: Listing[];
  page: number;
  limit: number;
  hasMore: boolean;
  nextPage: number | null;
};