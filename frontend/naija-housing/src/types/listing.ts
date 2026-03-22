export type PublishStatus =
  | "DRAFT"
  | "AWAITING_PAYMENT"
  | "PENDING_CONFIRMATION"
  | "PUBLISHED"
  | "EXPIRED"
  | "REJECTED"
  | "REMOVED_BY_ADMIN"
  | "APPEAL_PENDING";


export type PublishPlan =
  | "TRIAL_14_DAYS"
  | "PAID_30_DAYS"
  | null;

export type Listing = {
  _id: string;
  title?: string;
  description?: string;
  category?: string;
  subcategory?: string;
  price?: string;
  state?: string;
  location?: string;
  city?: string;
  images?: string[];
  publishStatus: PublishStatus;
  publishPlan?: PublishPlan;
  publishedAt?: string | null;
  expiresAt?: string | null;
  expiredAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};