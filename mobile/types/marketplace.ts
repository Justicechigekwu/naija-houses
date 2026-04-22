import type { AppealStatus, Listing, PublishPlan, RejectionType } from "@/types/listing";

export type BankDetails = {
  bankName: string;
  accountName: string;
  accountNumber: string;
};

export type ProofAttachment = {
  url: string;
  public_id: string;
  resource_type?: string;
  originalName?: string;
  uploadedAt?: string;
};

export type ActivePayment = {
  id: string;
  paymentCode: string;
  status: string;
  amount: number;
  accountAssignedAt: string;
  accountExpiresAt: string;
  isAccountActive: boolean;
  proofAttachments?: ProofAttachment[];
};

export type PublishOptionsResponse = {
  listingId: string;
  slug?: string;
  category: string;
  subcategory?: string;
  canUseTrial: boolean;
  trialDays: number;
  paidDays: number;
  price: number;
  publishStatus: Listing["publishStatus"];
  publishPlan: PublishPlan;
  rejectionType?: RejectionType;
  rejectionReason?: string;
  bankDetails: BankDetails | null;
  activePayment: ActivePayment | null;
};

export type ChoosePlanResponse = {
  message?: string;
  slug?: string;
  listing?: {
    _id: string;
    slug?: string;
  };
  payment?: {
    id?: string;
    paymentCode?: string;
    status?: string;
    amount?: number;
  };
};

export type PendingListing = Listing & {
  appealStatus?: AppealStatus;
};

export type AppealListing = Listing & {
  violationPolicy?: string;
  policyRoute?: string;
  policyLabel?: string;
  adminRemovalReason?: string;
};

export type PaymentMethodsResponse = {
  recommended: "BANK_TRANSFER" | "PAYSTACK" | "FLUTTERWAVE" | "CARD";
  methods: { key: string; label: string }[];
};

export type NotificationListing = {
  _id?: string;
  title?: string;
  publishStatus?: Listing["publishStatus"];
};

export type AppNotification = {
  _id: string;
  type:
    | "LISTING_APPROVED"
    | "LISTING_REJECTED"
    | "LISTING_EXPIRED"
    | "LISTING_EXPIRING_SOON"
    | "PAYMENT_CONFIRMED"
    | "PAYMENT_REJECTED"
    | "REVIEW_RECEIVED"
    | "REVIEW_REPLY"
    | "REVIEW_COMMENT"
    | "DRAFT_REMINDER"
    | "LISTING_REMOVED_BY_ADMIN"
    | "LISTING_APPEAL_SUBMITTED"
    | "LISTING_APPEAL_APPROVED"
    | "LISTING_APPEAL_REJECTED"
    | "SYSTEM";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  listing?: NotificationListing | null;
  metadata?: {
    listingId?: string;
    reviewId?: string;
    publishStatus?: string;
    rejectionType?: string;
    reason?: string;
    route?: string;
    actionLabel?: string;
    expiresAt?: string;
    appealStatus?: string;
  };
};