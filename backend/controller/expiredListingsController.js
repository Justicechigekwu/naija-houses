import Listing from "../models/listingModels.js";
import markExpiredListings from "../utils/markExpiredListings.js";

export const expiredListings = async (req, res) => {
  try {
    await markExpiredListings(req.user.id);

    const listings = await Listing.find({
      owner: req.user.id,
      publishStatus: "EXPIRED",
    })
      .select(
        "title images category subcategory price location city state publishStatus updatedAt createdAt expiresAt expiredAt publishPlan"
      )
      .sort({ expiredAt: -1, updatedAt: -1 });

    res.status(200).json(listings);
  } catch (error) {
    console.error("expiredListings error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch expired listings" });
  }
};