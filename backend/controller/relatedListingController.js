import Listing from "../models/listingModels.js";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

const normalizeText = (value = "") => String(value).trim().toLowerCase();

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const relatedListingController = async (req, res) => {
  try {
    const { id } = req.params;

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || DEFAULT_LIMIT, MAX_LIMIT);
    const skip = (page - 1) * limit;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const now = new Date();
    const lat = toNumber(req.query.lat);
    const lng = toNumber(req.query.lng);
    const preferredCity = req.query.city || "";
    const preferredState = req.query.state || "";

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

    const usePreferredGeo = lat !== null && lng !== null;
    const useListingGeo =
      listing.geo?.coordinates?.length === 2 &&
      typeof listing.geo.coordinates[0] === "number" &&
      typeof listing.geo.coordinates[1] === "number";

    const pipeline = [];

    if (usePreferredGeo) {
      pipeline.push({
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distanceMeters",
          spherical: true,
          key: "geo",
          query: {
            ...baseFilter,
            geo: { $exists: true },
          },
        },
      });
    } else if (useListingGeo) {
      pipeline.push({
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
      });
    } else {
      pipeline.push({ $match: baseFilter });
      pipeline.push({
        $addFields: {
          distanceMeters: 999999999,
        },
      });
    }

    pipeline.push({
      $addFields: {
        sameCity: preferredCity
          ? {
              $eq: [
                { $toLower: { $ifNull: ["$city", ""] } },
                normalizeText(preferredCity),
              ],
            }
          : false,
        sameState: preferredState
          ? {
              $eq: [
                { $toLower: { $ifNull: ["$state", ""] } },
                normalizeText(preferredState),
              ],
            }
          : false,
      },
    });

    pipeline.push({
      $sort: {
        sameCity: -1,
        sameState: -1,
        distanceMeters: 1,
        createdAt: -1,
      },
    });

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit + 1 });

    let related = await Listing.aggregate(pipeline);

    if (page === 1 && related.length < limit + 1) {
      const existingIds = related.map((item) => item._id);

      const fallback = await Listing.find({
        _id: { $ne: listing._id, $nin: existingIds },
        category: listing.category,
        publishStatus: "PUBLISHED",
        $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
      })
        .sort({ createdAt: -1 })
        .limit(limit + 1 - related.length)
        .lean();

      related = [...related, ...fallback];
    }

    const hasMore = related.length > limit;
    const listings = hasMore ? related.slice(0, limit) : related;

    return res.json({
      page,
      limit,
      listings,
      hasMore,
      nextPage: hasMore ? page + 1 : null,
    });
  } catch (error) {
    console.error("Related listings error:", error);
    return res.status(500).json({ message: "Failed to fetch related listings" });
  }
};

export default relatedListingController;