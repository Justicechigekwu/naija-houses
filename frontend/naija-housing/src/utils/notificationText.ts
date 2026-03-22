export const getNotificationBadge = (type: string) => {
  switch (type) {
    // Listing lifecycle
    case "LISTING_APPROVED":
      return "Approved";
    case "LISTING_REJECTED":
      return "Rejected";
    case "LISTING_EXPIRED":
      return "Expired";
    case "LISTING_EXPIRING_SOON":
      return "Reminder";

    // Payments
    case "PAYMENT_CONFIRMED":
      return "Paid";
    case "PAYMENT_REJECTED":
      return "Payment";

    // Drafts
    case "DRAFT_REMINDER":
      return "Draft";

    // Moderation / reports
    case "LISTING_REMOVED_BY_ADMIN":
      return "Moderation";

    // Appeals
    case "LISTING_APPEAL_SUBMITTED":
      return "Appeal";
    case "LISTING_APPEAL_APPROVED":
      return "Appeal";
    case "LISTING_APPEAL_REJECTED":
      return "Appeal";

    default:
      return "Notice"; // keep your original 👍
  }
};