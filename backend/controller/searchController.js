import Listing from "../models/listingModels.js";

const searchController = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") {
      return res.json([]);
    }

    const listings = await Listing.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { state: { $regex: q, $options: "i" } },
        { city: { $regex: q, $options: "i" } },
        { propertyType: { $regex: q, $options: "i" } },
      ],
    })
      .limit(10)
      .select("title location state images price");

    res.json(listings);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error during search" });
  }
};

export default searchController;
