import Listing from "../models/listingModels.js";

export const userListing = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const now = new Date();

    const listings = await Listing.find({
      owner: userId,
      publishStatus: "PUBLISHED",
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json(listings);
  } catch (error) {
    console.error("userListing error:", error);
    res.status(500).json({ message: "Failed to fetch user listings" });
  }
};