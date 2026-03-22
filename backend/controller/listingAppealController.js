import Listing from "../models/listingModels.js";
import { createNotification } from "../service/notificationService.js";

export const getAppealableListing = async (req, res) => {
  try {
    const { listingId } = req.params;

    const listing = await Listing.findOne({
      _id: listingId,
      owner: req.user.id,
      publishStatus: "REMOVED_BY_ADMIN",
    });

    if (!listing) {
      return res.status(404).json({ message: "Removed listing not found" });
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to load removed listing" });
  }
};

export const submitListingAppeal = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { appealMessage } = req.body;

    const listing = await Listing.findOne({
      _id: listingId,
      owner: req.user.id,
      publishStatus: "REMOVED_BY_ADMIN",
    });

    if (!listing) {
      return res.status(404).json({ message: "Removed listing not found" });
    }

    const removedAt = listing.adminRemovedAt ? new Date(listing.adminRemovedAt) : null;

    if (!removedAt) {
      return res.status(400).json({ message: "This listing cannot be appealed" });
    }

    const deadline = new Date(removedAt);
    deadline.setDate(deadline.getDate() + 30);

    if (new Date() > deadline) {
      return res.status(400).json({ message: "Appeal window has expired" });
    }

    listing.publishStatus = "APPEAL_PENDING";
    listing.appealStatus = "PENDING";
    listing.appealMessage = appealMessage || "";
    listing.appealSubmittedAt = new Date();

    await listing.save();

    await createNotification({
      userId: req.user.id,
      type: "LISTING_APPEAL_SUBMITTED",
      title: "Appeal submitted",
      message: `Your appeal for "${listing.title}" has been submitted and is awaiting admin review.`,
      listingId: listing._id,
      metadata: {
        listingId: listing._id,
        appealStatus: listing.appealStatus,
      },
    });

    res.json({
      message: "Appeal submitted successfully",
      listing,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to submit appeal" });
  }
};