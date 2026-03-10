export type PublishStatus =
  | "DRAFT"
  | "AWAITING_PAYMENT"
  | "PENDING_CONFIRMATION"
  | "PUBLISHED"
  | "EXPIRED"
  | "REJECTED";

export type Listing = {
  _id: string;
  title?: string;
  category?: string;
  subcategory?: string;
  price?: string;
  state?: string;
  location?: string;
  city?: string;
  images?: string[];
  description?: string;
  publishStatus: PublishStatus;
  updatedAt?: string;
  createdAt?: string;
};