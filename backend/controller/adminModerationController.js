import Listing from "../models/listingModels.js";
import userModel from "../models/userModel.js";
import Report from "../models/reportModel.js";
import { createNotification } from "../service/notificationService.js";
import { removeListingByAdmin } from "../service/listingModerationService.js";

export const adminDeleteListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const reason =
      req.body?.reason ||
      "This listing was removed for violating marketplace rules.";
    const violationPolicy = req.body?.violationPolicy || "OTHER";

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const updatedListing = await removeListingByAdmin({
      listing,
      adminId: req.admin.id,
      reason,
      violationPolicy,
      source: "REPORT_MODERATION",
      rejectionType: "PROHIBITED",
    });

    res.json({
      message: "Listing removed successfully",
      listing: updatedListing,
    });
  } catch (error) {
    console.error("adminDeleteListing error:", error);
    res.status(500).json({
      message: error.message || "Failed to remove listing",
    });
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
          rejectionType: "PROHIBITED",
          rejectionReason: "Owner account was banned by admin.",
          rejectedAt: new Date(),
          appealStatus: "NONE",
          appealMessage: "",
          appealSubmittedAt: null,
          appealReviewedAt: null,
          appealReviewNote: "",
          isArchivedByAdmin: true,
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
    res.status(500).json({
      message: error.message || "Failed to ban user",
    });
  }
};