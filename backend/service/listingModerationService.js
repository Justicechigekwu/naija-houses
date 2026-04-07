import Report from "../models/reportModel.js";
import { createNotification } from "../service/notificationService.js";
import { emitListingUpdated } from "../service/realtimeService.js";
import { POLICY_LINKS, POLICY_LABELS } from "../utils/policyLinks.js";

const cleanText = (value = "") => String(value || "").trim();

export const removeListingByAdmin = async ({
  listing,
  adminId,
  reason,
  violationPolicy = "OTHER",
  source = "MODERATION",
  rejectionType = "PROHIBITED",
}) => {
  if (!listing) {
    throw new Error("Listing is required");
  }

  const now = new Date();
  const finalReason =
    cleanText(reason) ||
    "This listing was removed for violating marketplace rules.";

  listing.publishStatus = "REMOVED_BY_ADMIN";
  listing.adminRemovedAt = now;
  listing.adminRemovalReason = finalReason;
  listing.violationPolicy = violationPolicy;

  // separation from payment rejection flow
  listing.rejectionType = rejectionType;
  listing.rejectionReason = finalReason;
  listing.rejectedAt = now;

  // reset appeal state so user can submit a fresh appeal
  listing.appealStatus = "NONE";
  listing.appealMessage = "";
  listing.appealSubmittedAt = null;
  listing.appealReviewedAt = null;
  listing.appealReviewNote = "";

  // if you use archive flags in your appeal flow
  listing.isArchivedByAdmin = true;

  await listing.save();

  await Report.updateMany(
    {
      targetListing: listing._id,
      status: { $in: ["OPEN", "REVIEWED"] },
    },
    {
      $set: {
        status: "RESOLVED",
        adminNote: `Listing removed by admin. Reason: ${finalReason}`,
        reviewedBy: adminId,
        reviewedAt: now,
      },
    }
  );

  await createNotification({
    userId: listing.owner,
    type: "LISTING_REMOVED_BY_ADMIN",
    title: "Listing removed by admin",
    message: `Your listing "${listing.title}" was removed by admin. You can review the reason and appeal within 30 days.`,
    listingId: listing._id,
    metadata: {
      listingId: listing._id,
      publishStatus: listing.publishStatus,
      rejectionType,
      source,
      route: `/appeals/${listing._id}`,
      action: "APPEAL_LISTING",
      actionLabel: "Review & Appeal",
      reason: finalReason,
      violationPolicy,
      policyRoute: POLICY_LINKS[violationPolicy] || "/appeal-policy",
      policyLabel: POLICY_LABELS[violationPolicy] || "Appeal Policy",
    },
  });

  emitListingUpdated(String(listing.owner), {
    listingId: listing._id,
    publishStatus: listing.publishStatus,
    rejectionType,
    updatedAt: listing.updatedAt,
  });

  return listing;
};