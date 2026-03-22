import Report from "../models/reportModel.js";
import Listing from "../models/listingModels.js";
import userModel from "../models/userModel.js";

export const createListingReport = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { reason, message } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.owner.toString() === req.user.id) {
      return res.status(400).json({ message: "You cannot report your own listing" });
    }

    const existing = await Report.findOne({
      targetType: "LISTING",
      targetListing: listingId,
      reportedBy: req.user.id,
      status: { $in: ["OPEN", "REVIEWED"] },
    });

    if (existing) {
      return res.status(400).json({ message: "You already reported this listing" });
    }

    const report = await Report.create({
      targetType: "LISTING",
      targetListing: listingId,
      reportedBy: req.user.id,
      reason,
      message: message || "",
    });

    res.status(201).json({
      message: "Listing reported successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to report listing" });
  }
};

export const createUserReport = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason, message } = req.body;

    const targetUser = await userModel.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser._id.toString() === req.user.id) {
      return res.status(400).json({ message: "You cannot report yourself" });
    }

    const existing = await Report.findOne({
      targetType: "USER",
      targetUser: userId,
      reportedBy: req.user.id,
      status: { $in: ["OPEN", "REVIEWED"] },
    });

    if (existing) {
      return res.status(400).json({ message: "You already reported this user" });
    }

    const report = await Report.create({
      targetType: "USER",
      targetUser: userId,
      reportedBy: req.user.id,
      reason,
      message: message || "",
    });

    res.status(201).json({
      message: "Seller reported successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to report seller" });
  }
};