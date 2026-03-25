import Listing from "../models/listingModels.js";

const relatedListingController = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const now = new Date();

    const baseFilter = {
      _id: { $ne: listing._id },
      category: listing.category,
      subcategory: listing.subcategory,
      publishStatus: "PUBLISHED",
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
    };

    if (
      listing.category === "PROPERTY" &&
      listing.subcategory === "HOUSES_APARTMENTS" &&
      listing.attributes?.propertyType
    ) {
      baseFilter["attributes.propertyType"] = listing.attributes.propertyType;
    }

    if (
      listing.category === "VEHICLES" &&
      listing.subcategory === "CARS_TRUCKS" &&
      listing.attributes?.make
    ) {
      baseFilter["attributes.make"] = listing.attributes.make;
    }

    if (
      listing.category === "PHONES" &&
      listing.subcategory === "SMART_PHONES" &&
      listing.attributes?.brand
    ) {
      baseFilter["attributes.brand"] = listing.attributes.brand;
    }

    let related = [];

    if (
      listing.geo?.coordinates?.length === 2 &&
      typeof listing.geo.coordinates[0] === "number" &&
      typeof listing.geo.coordinates[1] === "number"
    ) {
      related = await Listing.aggregate([
        {
          $geoNear: {
            near: listing.geo,
            distanceField: "distanceMeters",
            spherical: true,
            key: "geo",
            query: {
              ...baseFilter,
              geo: { $exists: true },
            },
          },
        },
        {
          $sort: {
            distanceMeters: 1,
            createdAt: -1,
          },
        },
        {
          $limit: 20,
        },
      ]);
    } else {
      related = await Listing.find(baseFilter)
        .sort({ createdAt: -1 })
        .limit(20);
    }

    if (related.length < 20) {
      const existingIds = related.map((item) => item._id);

      const fallback = await Listing.find({
        _id: { $ne: listing._id, $nin: existingIds },
        category: listing.category,
        publishStatus: "PUBLISHED",
        $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
      })
        .sort({ createdAt: -1 })
        .limit(20 - related.length);

      related = [...related, ...fallback];
    }

    res.json(related);
  } catch (error) {
    console.error("Related listings error:", error);
    res.status(500).json({ message: "Failed to fetch related listings" });
  }
};

export default relatedListingController;