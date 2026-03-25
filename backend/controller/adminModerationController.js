import Listing from "../models/listingModels.js";
import userModel from "../models/userModel.js";
import Report from "../models/reportModel.js";
import { createNotification } from "../service/notificationService.js";
import { POLICY_LINKS, POLICY_LABELS } from "../utils/policyLinks.js";

export const adminDeleteListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const reason =
      req.body?.reason || "This listing was removed for violating marketplace rules.";
    const violationPolicy = req.body?.violationPolicy || "OTHER";

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    listing.publishStatus = "REMOVED_BY_ADMIN";
    listing.adminRemovedAt = new Date();
    listing.adminRemovalReason = reason;
    listing.violationPolicy = violationPolicy;
    listing.appealStatus = "NONE";
    listing.appealMessage = "";
    listing.appealSubmittedAt = null;
    listing.appealReviewedAt = null;
    listing.appealReviewNote = "";

    await listing.save();

    await Report.updateMany(
      {
        targetListing: listing._id,
        status: { $in: ["OPEN", "REVIEWED"] },
      },
      {
        $set: {
          status: "RESOLVED",
          adminNote: `Listing removed by admin. Reason: ${listing.adminRemovalReason}`,
          reviewedBy: req.admin.id,
          reviewedAt: new Date(),
        },
      }
    );

    await createNotification({
      userId: listing.owner,
      type: "LISTING_REMOVED_BY_ADMIN",
      title: "Listing removed by admin",
      message: `Your listing "${listing.title}" was removed by admin. You can appeal within 30 days.`,
      listingId: listing._id,
      metadata: {
        route: `/appeals/${listing._id}`,
        action: "APPEAL_LISTING",
        actionLabel: "Appeal",
        listingId: listing._id,
        reason: listing.adminRemovalReason,
        violationPolicy: listing.violationPolicy,
        policyRoute: POLICY_LINKS[listing.violationPolicy] || "/appeal-policy",
        policyLabel: POLICY_LABELS[listing.violationPolicy] || "Appeal Policy",
      },
    });

    res.json({
      message: "Listing removed successfully",
      listing,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to remove listing" });
  }
};

export const adminDeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const reason =
      req.body?.reason ||
      "Your account has been banned for violating marketplace/community standards.";

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBanned = true;
    user.bannedAt = new Date();
    user.banReason = reason;

    await user.save();

    await Listing.updateMany(
      { owner: userId },
      {
        $set: {
          publishStatus: "REMOVED_BY_ADMIN",
          adminRemovedAt: new Date(),
          adminRemovalReason: "Owner account was banned by admin.",
          violationPolicy: "OTHER",
          appealStatus: "NONE",
          appealMessage: "",
          appealSubmittedAt: null,
          appealReviewedAt: null,
          appealReviewNote: "",
        },
      }
    );

    await Report.updateMany(
      { targetUser: userId, status: { $in: ["OPEN", "REVIEWED"] } },
      {
        $set: {
          status: "RESOLVED",
          adminNote: `User banned by admin. Reason: ${reason}`,
          reviewedBy: req.admin.id,
          reviewedAt: new Date(),
        },
      }
    );

    await Report.updateMany(
      { reportedBy: userId },
      {
        $set: {
          status: "DISMISSED",
          adminNote: "Reporter account banned by admin.",
          reviewedBy: req.admin.id,
          reviewedAt: new Date(),
        },
      }
    );

    await createNotification({
      userId: user._id,
      type: "SYSTEM",
      title: "Account banned",
      message:
        reason ||
        "Your account has been banned for violating marketplace/community standards.",
      metadata: {
        action: "ACCOUNT_BANNED",
        actionLabel: "OK",
      },
    });

    res.json({
      message: "User banned successfully",
    });
  } catch (error) {
    console.error("adminDeleteUser error:", error);
    res.status(500).json({ message: error.message || "Failed to ban user" });
  }
};