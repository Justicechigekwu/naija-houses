import Listing from "../models/listingModels.js";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const escapeRegex = (value = "") =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeText = (value = "") => String(value).trim().toLowerCase();

const buildPublishedMatch = () => {
  const now = new Date();

  return {
    publishStatus: "PUBLISHED",
    $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
  };
};

const buildLocationPriorityFields = (city, state) => ({
  $addFields: {
    sameCity: {
      $cond: [
        { $eq: [normalizeText(city), ""] },
        false,
        { $eq: ["$cityNormalized", normalizeText(city)] },
      ],
    },
    sameState: {
      $cond: [
        { $eq: [normalizeText(state), ""] },
        false,
        { $eq: ["$stateNormalized", normalizeText(state)] },
      ],
    },
  },
});

const buildDistanceBucketFields = {
  $addFields: {
    distanceBucket: {
      $switch: {
        branches: [
          { case: { $lte: ["$distanceMeters", 10000] }, then: 1 },
          { case: { $lte: ["$distanceMeters", 30000] }, then: 2 },
          { case: { $lte: ["$distanceMeters", 80000] }, then: 3 },
        ],
        default: 4,
      },
    },
  },
};

const ownerLookupStages = [
  {
    $lookup: {
      from: "usermodels",
      localField: "owner",
      foreignField: "_id",
      as: "owner",
    },
  },
  {
    $unwind: {
      path: "$owner",
      preserveNullAndEmptyArrays: true,
    },
  },
];

const baseProject = {
  title: 1,
  description: 1,
  price: 1,
  category: 1,
  subcategory: 1,
  city: 1,
  state: 1,
  location: 1,
  images: 1,
  owner: {
    _id: "$owner._id",
    firstName: "$owner.firstName",
    lastName: "$owner.lastName",
    avatar: "$owner.avatar",
  },
  publishStatus: 1,
  createdAt: 1,
  distanceMeters: 1,
  sameCity: 1,
  sameState: 1,
  distanceBucket: 1,
};

export const getLocationFeed = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || DEFAULT_LIMIT, MAX_LIMIT);
    const skip = (page - 1) * limit;

    const lat = toNumber(req.query.lat);
    const lng = toNumber(req.query.lng);
    const city = req.query.city || "";
    const state = req.query.state || "";

    const match = buildPublishedMatch();
    const useGeo = lat !== null && lng !== null;

    const pipeline = [];

    if (useGeo) {
      pipeline.push({
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distanceMeters",
          spherical: true,
          key: "geo",
          query: {
            ...match,
            geo: { $exists: true },
          },
        },
      });
    } else {
      pipeline.push({ $match: match });
      pipeline.push({
        $addFields: {
          distanceMeters: 999999999,
        },
      });
    }

    pipeline.push(buildLocationPriorityFields(city, state));
    pipeline.push(buildDistanceBucketFields);

    pipeline.push({
      $sort: {
        sameCity: -1,
        sameState: -1,
        distanceBucket: 1,
        distanceMeters: 1,
        createdAt: -1,
      },
    });

    pipeline.push({ $skip: skip }, { $limit: limit });
    pipeline.push(...ownerLookupStages);
    pipeline.push({ $project: baseProject });

    const listings = await Listing.aggregate(pipeline);

    res.json({
      page,
      limit,
      listings,
    });
  } catch (error) {
    console.error("getLocationFeed error:", error);
    res.status(500).json({
      message: error.message || "Failed to load location feed",
    });
  }
};

export const searchListingsByLocation = async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || DEFAULT_LIMIT, MAX_LIMIT);
    const skip = (page - 1) * limit;

    const lat = toNumber(req.query.lat);
    const lng = toNumber(req.query.lng);
    const city = req.query.city || "";
    const state = req.query.state || "";
    const category = String(req.query.category || "").trim();
    const subcategory = String(req.query.subcategory || "").trim();

    const regex = q ? new RegExp(escapeRegex(q), "i") : null;
    const baseMatch = buildPublishedMatch();
    const useGeo = lat !== null && lng !== null;

    const searchMatch = {
      ...baseMatch,
      ...(category ? { category } : {}),
      ...(subcategory ? { subcategory } : {}),
      ...(regex
        ? {
            $or: [
              { title: regex },
              { description: regex },
              { location: regex },
              { city: regex },
              { state: regex },
              { category: regex },
              { subcategory: regex },
            ],
          }
        : {}),
    };

    const pipeline = [];

    if (useGeo) {
      pipeline.push({
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distanceMeters",
          spherical: true,
          key: "geo",
          query: {
            ...searchMatch,
            geo: { $exists: true },
          },
        },
      });
    } else {
      pipeline.push({ $match: searchMatch });
      pipeline.push({
        $addFields: {
          distanceMeters: 999999999,
        },
      });
    }

    pipeline.push(buildLocationPriorityFields(city, state));
    pipeline.push(buildDistanceBucketFields);

    pipeline.push({
      $addFields: {
        relevanceScore: {
          $switch: {
            branches: [
              {
                case: regex ? { $regexMatch: { input: "$title", regex } } : false,
                then: 1,
              },
              {
                case: regex ? { $regexMatch: { input: "$subcategory", regex } } : false,
                then: 2,
              },
              {
                case: regex ? { $regexMatch: { input: "$category", regex } } : false,
                then: 3,
              },
              {
                case: regex ? { $regexMatch: { input: "$description", regex } } : false,
                then: 4,
              },
            ],
            default: 5,
          },
        },
      },
    });

    pipeline.push({
      $sort: {
        relevanceScore: 1,
        sameCity: -1,
        sameState: -1,
        distanceBucket: 1,
        distanceMeters: 1,
        createdAt: -1,
      },
    });

    pipeline.push({ $skip: skip }, { $limit: limit });
    pipeline.push(...ownerLookupStages);
    pipeline.push({
      $project: {
        ...baseProject,
        relevanceScore: 1,
      },
    });

    const listings = await Listing.aggregate(pipeline);

    const similarMatch = {
      ...baseMatch,
      ...(category ? { category } : {}),
      ...(subcategory ? { subcategory } : {}),
    };

    const similarPipeline = [];

    if (useGeo) {
      similarPipeline.push({
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distanceMeters",
          spherical: true,
          key: "geo",
          query: {
            ...similarMatch,
            geo: { $exists: true },
          },
        },
      });
    } else {
      similarPipeline.push({ $match: similarMatch });
      similarPipeline.push({
        $addFields: {
          distanceMeters: 999999999,
        },
      });
    }

    similarPipeline.push(buildLocationPriorityFields(city, state));
    similarPipeline.push(buildDistanceBucketFields);

    if (regex) {
      similarPipeline.push({
        $match: {
          title: { $not: regex },
          description: { $not: regex },
        },
      });
    }

    similarPipeline.push({
      $sort: {
        sameCity: -1,
        sameState: -1,
        distanceBucket: 1,
        distanceMeters: 1,
        createdAt: -1,
      },
    });

    similarPipeline.push({ $limit: 12 });
    similarPipeline.push(...ownerLookupStages);
    similarPipeline.push({ $project: baseProject });

    const similarListings = await Listing.aggregate(similarPipeline);

    res.json({
      page,
      limit,
      listings,
      similarListings,
    });
  } catch (error) {
    console.error("searchListingsByLocation error:", error);
    res.status(500).json({
      message: error.message || "Failed to search listings by location",
    });
  }
};