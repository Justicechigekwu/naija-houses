export const getNotificationBadge = (type: string) => {
  switch (type) {
    case "LISTING_APPROVED":
      return "Approved";
    case "LISTING_REJECTED":
      return "Rejected";
    case "LISTING_EXPIRED":
      return "Expired";
    case "LISTING_EXPIRING_SOON":
      return "Reminder";

    case "PAYMENT_CONFIRMED":
      return "Paid";
    case "PAYMENT_REJECTED":
      return "Payment";

    case "REVIEW_RECEIVED":
      return "Review";
    case "REVIEW_REPLY":
      return "Review";

    case "DRAFT_REMINDER":
      return "Draft";

    case "LISTING_REMOVED_BY_ADMIN":
      return "Moderation";

    case "LISTING_APPEAL_SUBMITTED":
      return "Appeal";
    case "APPEAL_PENDING":
      return "Appeal";
    case "LISTING_APPEAL_APPROVED":
      return "Appeal";
    case "LISTING_APPEAL_REJECTED":
      return "Appeal";

    default:
      return "Notice";
  }
};