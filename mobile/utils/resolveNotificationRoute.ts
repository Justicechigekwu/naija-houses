import type { AppNotification } from "@/types/marketplace";

export function resolveNotificationRoute(item: AppNotification) {
  const backendRoute = item.metadata?.route;
  if (backendRoute) return backendRoute;

  const listingId = item.metadata?.listingId || item.listing?._id;
  const reviewId = item.metadata?.reviewId;
  const rejectionType = item.metadata?.rejectionType;

  switch (item.type) {
    case "DRAFT_REMINDER":
      return "/drafts";

    case "LISTING_EXPIRED":
      return "/expired";

    case "PAYMENT_REJECTED":
      return listingId
        ? `/listing-actions/${listingId}/rejected-payment`
        : "/notification";

    case "LISTING_REJECTED":
      if (!listingId) return "/notification";
      return rejectionType === "PAYMENT"
        ? `/listing-actions/${listingId}/rejected-payment`
        : `/listing-actions/${listingId}/appeal`;

    case "LISTING_REMOVED_BY_ADMIN":
      return listingId
        ? `/listing-actions/${listingId}/appeal`
        : "/notification";

    case "LISTING_APPEAL_SUBMITTED":
      return "/pending";

    case "LISTING_APPEAL_APPROVED":
      return "/pending";

    case "LISTING_APPEAL_REJECTED":
      return listingId
        ? `/listing-actions/${listingId}/appeal`
        : "/notification";

    case "PAYMENT_CONFIRMED":
      return "/pending";

    case "REVIEW_RECEIVED":
    case "REVIEW_REPLY":
    case "REVIEW_COMMENT":
      return reviewId ? `/feedback/${reviewId}` : "/feedback";

    default:
      return "/notification";
  }
}