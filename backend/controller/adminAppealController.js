import Listing from "../models/listingModels.js";
import Report from "../models/reportModel.js";
import { createNotification } from "../service/notificationService.js";
import { emitListingUpdated } from "../service/realtimeService.js";

export const getPendingAppeals = async (req, res) => {
  try {
    const listings = await Listing.find({
      publishStatus: "APPEAL_PENDING",
      appealStatus: "PENDING",
    })
      .sort({ appealSubmittedAt: -1 })
      .populate("owner", "firstName lastName email avatar");

    res.json(listings);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to load appeals",
    });
  }
};

export const approveAppeal = async (req, res) => {
  try {
    const { listingId } = req.params;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (
      listing.publishStatus !== "APPEAL_PENDING" ||
      listing.appealStatus !== "PENDING"
    ) {
      return res.status(400).json({
        message: "This listing is not awaiting appeal review",
      });
    }

    listing.publishStatus = "PUBLISHED";
    listing.appealStatus = "APPROVED";
    listing.appealReviewedAt = new Date();
    listing.appealReviewNote = "";
    listing.isArchivedByAdmin = false;
    listing.adminRemovedAt = null;
    listing.adminRemovalReason = "";
    listing.violationPolicy = "OTHER";
    listing.rejectionType = "NONE";
    listing.rejectionReason = "";
    listing.rejectedAt = null;

    await listing.save();

    await Report.updateMany(
      {
        targetListing: listing._id,
        status: { $in: ["OPEN", "REVIEWED"] },
      },
      {
        $set: {
          status: "RESOLVED",
          adminNote: "Listing appeal approved. Listing restored by admin.",
          reviewedBy: req.admin.id,
          reviewedAt: new Date(),
        },
      }
    );

    await createNotification({
      userId: listing.owner,
      type: "LISTING_APPEAL_APPROVED",
      title: "Appeal approved",
      message: `Your appeal for "${listing.title}" has been approved and your listing is live again.`,
      listingId: listing._id,
      metadata: {
        listingId: listing._id,
        publishStatus: listing.publishStatus,
        appealStatus: listing.appealStatus,
        route: listing.slug ? `/listings/${listing.slug}` : `/listings/${listing._id}`,
        actionLabel: "View listing",
      },
    });

    emitListingUpdated(String(listing.owner), {
      listingId: listing._id,
      publishStatus: listing.publishStatus,
      appealStatus: listing.appealStatus,
      updatedAt: listing.updatedAt,
    });

    res.json({
      message: "Appeal approved successfully",
      listing,
    });
  } catch (error) {
    console.error("approveAppeal error:", error);
    res.status(500).json({
      message: error.message || "Failed to approve appeal",
    });
  }
};

export const rejectAppeal = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { reviewNote } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (
      listing.publishStatus !== "APPEAL_PENDING" ||
      listing.appealStatus !== "PENDING"
    ) {
      return res.status(400).json({
        message: "This listing is not awaiting appeal review",
      });
    }

    listing.publishStatus = "REMOVED_BY_ADMIN";
    listing.appealStatus = "REJECTED";
    listing.appealReviewedAt = new Date();
    listing.appealReviewNote = reviewNote?.trim() || "";

    await listing.save();

    await createNotification({
      userId: listing.owner,
      type: "LISTING_APPEAL_REJECTED",
      title: "Appeal rejected",
      message: `Your appeal for "${listing.title}" was rejected by admin.`,
      listingId: listing._id,
      metadata: {
        listingId: listing._id,
        appealStatus: listing.appealStatus,
        appealReviewNote: listing.appealReviewNote,
        route: `/appeals/${listing._id}`,
        actionLabel: "View details",
      },
    });

    emitListingUpdated(String(listing.owner), {
      listingId: listing._id,
      publishStatus: listing.publishStatus,
      appealStatus: listing.appealStatus,
      updatedAt: listing.updatedAt,
    });

    res.json({
      message: "Appeal rejected successfully",
      listing,
    });
  } catch (error) {
    console.error("rejectAppeal error:", error);
    res.status(500).json({
      message: error.message || "Failed to reject appeal",
    });
  }
};