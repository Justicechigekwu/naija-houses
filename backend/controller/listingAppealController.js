import Listing from "../models/listingModels.js";
import { createNotification } from "../service/notificationService.js";
import { POLICY_LINKS, POLICY_LABELS } from "../utils/policyLinks.js";

export const getAppealListing = async (req, res) => {
  try {
    const { listingId } = req.params;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to appeal this listing" });
    }

    if (listing.publishStatus !== "REMOVED_BY_ADMIN") {
      return res.status(400).json({
        message: "This listing is not currently eligible for appeal",
      });
    }

    return res.status(200).json({
      _id: listing._id,
      title: listing.title,
      listingType: listing.listingType,
      price: listing.price,
      location: listing.location,
      city: listing.city,
      state: listing.state,
      description: listing.description,
      postedBy: listing.postedBy,
      category: listing.category,
      subcategory: listing.subcategory,
      attributes: listing.attributes || {},
      images: listing.images || [],
      publishStatus: listing.publishStatus,
      appealStatus: listing.appealStatus,
      adminRemovalReason: listing.adminRemovalReason || "",
      violationPolicy: listing.violationPolicy || "OTHER",
      policyRoute: POLICY_LINKS[listing.violationPolicy] || "/appeal-policy",
      policyLabel: POLICY_LABELS[listing.violationPolicy] || "Appeal Policy",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to load appeal listing",
    });
  }
};

export const submitAppeal = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { appealMessage } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to appeal this listing" });
    }

    if (listing.publishStatus !== "REMOVED_BY_ADMIN") {
      return res.status(400).json({
        message: "This listing cannot be appealed right now",
      });
    }

    if (!appealMessage || !appealMessage.trim()) {
      return res.status(400).json({
        message: "Appeal message is required",
      });
    }

    listing.publishStatus = "APPEAL_PENDING";
    listing.appealStatus = "PENDING";
    listing.appealMessage = appealMessage.trim();
    listing.appealSubmittedAt = new Date();
    listing.appealReviewedAt = null;
    listing.appealReviewNote = "";

    await listing.save();

    await createNotification({
      userId: listing.owner,
      type: "LISTING_APPEAL_SUBMITTED",
      title: "Appeal submitted",
      message: `Your appeal for "${listing.title}" has been submitted and is awaiting admin review.`,
      listingId: listing._id,
      metadata: {
        listingId: listing._id,
        publishStatus: listing.publishStatus,
        appealStatus: listing.appealStatus,
        route: "/pending",
        actionLabel: "View status",
      },
    });

    return res.status(200).json({
      message: "Appeal submitted successfully",
      listing,
    });
  } catch (error) {
    console.error("submitAppeal error:", error);
    return res.status(500).json({
      message: error.message || "Failed to submit appeal",
    });
  }
};