import Listing from "../models/listingModels.js";

const escapeRegex = (value = "") =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeText = (value = "") => String(value).trim().toLowerCase();

const searchController = async (req, res) => {
  try {
    const {
      q = "",
      search = "",
      category,
      subcategory,
      listingType,
      state,
      city,
      limit,
    } = req.query;

    const queryText = String(q || search || "").trim();
    const now = new Date();
    const parsedLimit = Math.min(Number(limit) || 10, 20);

    const filter = {
      publishStatus: "PUBLISHED",
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
    };

    if (category) {
      filter.category = String(category).toUpperCase();
    }

    if (subcategory) {
      filter.subcategory = String(subcategory).toUpperCase();
    }

    if (listingType) {
      filter.listingType = listingType;
    }

    const and = [];

    if (state) {
      and.push({
        $or: [
          { stateNormalized: normalizeText(state) },
          {
            state: {
              $regex: `^${escapeRegex(String(state).trim())}$`,
              $options: "i",
            },
          },
        ],
      });
    }

    if (city) {
      and.push({
        $or: [
          { cityNormalized: normalizeText(city) },
          {
            city: {
              $regex: `^${escapeRegex(String(city).trim())}$`,
              $options: "i",
            },
          },
        ],
      });
    }

    if (queryText) {
      const regex = new RegExp(escapeRegex(queryText), "i");

      and.push({
        $or: [
          { title: regex },
          { description: regex },
          { city: regex },
          { state: regex },
          { category: regex },
          { subcategory: regex },

          { "attributes.propertyType": regex },
          { "attributes.brand": regex },
          { "attributes.make": regex },
          { "attributes.model": regex },
          { "attributes.condition": regex },
        ],
      });
    }

    if (and.length > 0) {
      filter.$and = and;
    }

    const listings = await Listing.find(filter)
      .sort({ createdAt: -1 })
      .limit(parsedLimit)
      .select(
        "_id slug title city state images price attributes category subcategory listingType postedBy publishStatus createdAt"
      )
      .lean();

    return res.json(listings);
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      message: error.message || "Server error during search",
    });
  }
};

export default searchController;