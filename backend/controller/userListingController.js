import Listing from "../models/listingModels.js";

export const userListing = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID nid required"});
        }

        const listings = await Listing.find({ owner: userId }).sort({ createdAt: -1 });
        res.status(200).json(listings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch user listings', error })
    }
};