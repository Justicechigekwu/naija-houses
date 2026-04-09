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
export type AppealStatus = "PENDING" | "APPROVED" | "REJECTED" | null;
export type RejectionType = "NONE" | "PAYMENT" | "LISTING" | "PROHIBITED" | null;
export type ListingType = "Sale" | "Rent" | "Shortlet";
export type PostedBy = "Owner" | "Agent" | "Dealer" | "Seller";
export type FormValue = string | number | boolean | string[] | null | undefined;

export type ListingsMeta = {
  mode?: "manual" | "geo";
  exactLocationOnly?: boolean;
  selectedCity?: string;
  selectedState?: string;
};

export type ListingImage = {
  url: string;
  public_id?: string;
};

export type DynamicField = {
  key: string;
  label: string;
  type: string;
  options?: string[];
  required?: boolean;
};

export type SubcategoryConfig = {
  label: string;
  fields: DynamicField[];
};

export type ListingFormShape = {
  title: string;
  listingType: ListingType | "";
  price: string;
  city: string;
  state: string;
  description: string;
  postedBy: PostedBy | "";
  category: string;
  subcategory: string;
};

export type Listing = {
  _id: string;
  slug?: string;
  title?: string;
  description?: string;
  category?: string;
  subcategory?: string;
  price?: number;
  state?: string;
  city?: string;
  attributes?: Record<string, string | number | boolean | string[]>;
  images?: ListingImage[];
  publishStatus?: PublishStatus;
  publishPlan?: PublishPlan;
  publishedAt?: string | null;
  expiresAt?: string | null;
  listingType?: ListingType;
  expiredAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  postedBy?: PostedBy;
  distanceMeters?: number;
  rejectionType?: RejectionType;
  rejectionReason?: string;
  rejectedAt?: string | null;
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
  meta?: ListingsMeta;
};