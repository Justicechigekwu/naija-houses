import Listing from "../models/listingModels.js";

export const pendingListings = async (req, res) => {
  try {
    const listings = await Listing.find({
      owner: req.user.id,
      publishStatus: { $in: ["PENDING_CONFIRMATION", "APPEAL_PENDING"] },
    })
      .select(
        "title images category subcategory price location city state publishStatus appealStatus updatedAt createdAt"
      )
      .sort({ updatedAt: -1 });

    res.status(200).json(listings);
  } catch (error) {
    console.error("pendingListings error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch pending listings" });
  }
};

export const allPendingListingsForAdmin = async (req, res) => {
  try {
    const listings = await Listing.find({
      publishStatus: { $in: ["PENDING_CONFIRMATION", "APPEAL_PENDING"] },
    })
      .populate("owner", "firstName lastName email phone")
      .sort({ updatedAt: -1 });

    res.status(200).json(listings);
  } catch (error) {
    console.error("allPendingListingsForAdmin error:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch admin pending listings",
    });
  }
};