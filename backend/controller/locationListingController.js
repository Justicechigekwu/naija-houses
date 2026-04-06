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
  slug: 1,
  description: 1,
  price: 1,
  category: 1,
  subcategory: 1,
  listingType: 1,
  city: 1,
  state: 1,
  images: 1,
  postedBy: 1,
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

const buildManualMatch = ({
  city,
  state,
  category,
  subcategory,
  q,
  listingType,
}) => {
  const match = {
    ...buildPublishedMatch(),
  };

  const and = [];

  if (state) {
    and.push({
      $or: [
        { stateNormalized: normalizeText(state) },
        { state: { $regex: `^${escapeRegex(String(state).trim())}$`, $options: "i" } },
      ],
    });
  }

  if (city) {
    and.push({
      $or: [
        { cityNormalized: normalizeText(city) },
        { city: { $regex: `^${escapeRegex(String(city).trim())}$`, $options: "i" } },
      ],
    });
  }

  if (category) {
    match.category = category;
  }

  if (subcategory) {
    match.subcategory = subcategory;
  }

  if (listingType) {
    match.listingType = listingType;
  }

  if (q) {
    const regex = new RegExp(escapeRegex(q), "i");
    and.push({
      $or: [
        { title: regex },
        { description: regex },
        { city: regex },
        { state: regex },
        { category: regex },
        { subcategory: regex },
      ],
    });
  }

  if (and.length > 0) {
    match.$and = [...(match.$and || []), ...and];
  }

  return match;
};

const runGeoFeedPipeline = async ({
  lat,
  lng,
  city,
  state,
  page,
  limit,
  listingType,
}) => {
  const skip = (page - 1) * limit;
  const match = buildPublishedMatch();
  if (listingType) match.listingType = listingType;

  let results = [];

  if (lat !== null && lng !== null) {
    results = await Listing.aggregate([
      {
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
      },
      buildLocationPriorityFields(city, state),
      buildDistanceBucketFields,
      {
        $sort: {
          sameCity: -1,
          sameState: -1,
          distanceBucket: 1,
          distanceMeters: 1,
          createdAt: -1,
        },
      },
      { $skip: skip },
      { $limit: limit + 1 },
      ...ownerLookupStages,
      { $project: baseProject },
    ]);
  }

  if (!results.length) {
    results = await Listing.aggregate([
      { $match: match },
      {
        $addFields: {
          distanceMeters: 999999999,
        },
      },
      buildLocationPriorityFields(city, state),
      buildDistanceBucketFields,
      {
        $sort: {
          sameCity: -1,
          sameState: -1,
          distanceBucket: 1,
          distanceMeters: 1,
          createdAt: -1,
        },
      },
      { $skip: skip },
      { $limit: limit + 1 },
      ...ownerLookupStages,
      { $project: baseProject },
    ]);
  }

  return results;
};

const runManualFeedPipeline = async ({
  city,
  state,
  page,
  limit,
  listingType,
}) => {
  const skip = (page - 1) * limit;

  const match = buildManualMatch({
    city,
    state,
    listingType,
  });

  return Listing.aggregate([
    { $match: match },
    {
      $addFields: {
        distanceMeters: 999999999,
      },
    },
    buildLocationPriorityFields(city, state),
    buildDistanceBucketFields,
    {
      $sort: {
        createdAt: -1,
      },
    },
    { $skip: skip },
    { $limit: limit + 1 },
    ...ownerLookupStages,
    { $project: baseProject },
  ]);
};

const runManualSimilarPipeline = async ({
  city,
  state,
  limit,
  category,
  subcategory,
  q,
  listingType,
}) => {
  if (!city || !state) return [];

  const match = buildManualMatch({
    city: "",
    state,
    category,
    subcategory,
    q,
    listingType,
  });

  match.cityNormalized = { $ne: normalizeText(city) };

  return Listing.aggregate([
    { $match: match },
    {
      $addFields: {
        distanceMeters: 999999999,
      },
    },
    buildLocationPriorityFields(city, state),
    buildDistanceBucketFields,
    {
      $sort: {
        createdAt: -1,
      },
    },
    { $limit: limit },
    ...ownerLookupStages,
    { $project: baseProject },
  ]);
};

const runGeoSearchPipeline = async ({
  q,
  category,
  subcategory,
  city,
  state,
  lat,
  lng,
  page,
  limit,
  listingType,
}) => {
  const skip = (page - 1) * limit;
  const regex = q ? new RegExp(escapeRegex(q), "i") : null;
  const baseMatch = buildPublishedMatch();

  if (category) baseMatch.category = category;
  if (subcategory) baseMatch.subcategory = subcategory;
  if (listingType) baseMatch.listingType = listingType;

  const searchMatch = {
    ...baseMatch,
    ...(regex
      ? {
          $or: [
            { title: regex },
            { description: regex },
            { city: regex },
            { state: regex },
            { category: regex },
            { subcategory: regex },
          ],
        }
      : {}),
  };

  let results = [];

  if (lat !== null && lng !== null) {
    results = await Listing.aggregate([
      {
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
      },
      buildLocationPriorityFields(city, state),
      buildDistanceBucketFields,
      {
        $addFields: {
          relevanceScore: {
            $switch: {
              branches: [
                {
                  case: regex ? { $regexMatch: { input: "$title", regex } } : false,
                  then: 1,
                },
                {
                  case: regex
                    ? { $regexMatch: { input: "$subcategory", regex } }
                    : false,
                  then: 2,
                },
                {
                  case: regex ? { $regexMatch: { input: "$category", regex } } : false,
                  then: 3,
                },
                {
                  case: regex
                    ? { $regexMatch: { input: "$description", regex } }
                    : false,
                  then: 4,
                },
              ],
              default: 5,
            },
          },
        },
      },
      {
        $sort: {
          relevanceScore: 1,
          sameCity: -1,
          sameState: -1,
          distanceBucket: 1,
          distanceMeters: 1,
          createdAt: -1,
        },
      },
      { $skip: skip },
      { $limit: limit + 1 },
      ...ownerLookupStages,
      {
        $project: {
          ...baseProject,
          relevanceScore: 1,
        },
      },
    ]);
  }

  if (!results.length) {
    results = await Listing.aggregate([
      { $match: searchMatch },
      {
        $addFields: {
          distanceMeters: 999999999,
        },
      },
      buildLocationPriorityFields(city, state),
      buildDistanceBucketFields,
      {
        $addFields: {
          relevanceScore: {
            $switch: {
              branches: [
                {
                  case: regex ? { $regexMatch: { input: "$title", regex } } : false,
                  then: 1,
                },
                {
                  case: regex
                    ? { $regexMatch: { input: "$subcategory", regex } }
                    : false,
                  then: 2,
                },
                {
                  case: regex ? { $regexMatch: { input: "$category", regex } } : false,
                  then: 3,
                },
                {
                  case: regex
                    ? { $regexMatch: { input: "$description", regex } }
                    : false,
                  then: 4,
                },
              ],
              default: 5,
            },
          },
        },
      },
      {
        $sort: {
          relevanceScore: 1,
          sameCity: -1,
          sameState: -1,
          distanceBucket: 1,
          distanceMeters: 1,
          createdAt: -1,
        },
      },
      { $skip: skip },
      { $limit: limit + 1 },
      ...ownerLookupStages,
      {
        $project: {
          ...baseProject,
          relevanceScore: 1,
        },
      },
    ]);
  }

  return results;
};

const runManualSearchPipeline = async ({
  q,
  category,
  subcategory,
  city,
  state,
  page,
  limit,
  listingType,
}) => {
  const skip = (page - 1) * limit;

  const match = buildManualMatch({
    city,
    state,
    category,
    subcategory,
    q,
    listingType,
  });

  return Listing.aggregate([
    { $match: match },
    {
      $addFields: {
        distanceMeters: 999999999,
      },
    },
    buildLocationPriorityFields(city, state),
    buildDistanceBucketFields,
    {
      $sort: {
        createdAt: -1,
      },
    },
    { $skip: skip },
    { $limit: limit + 1 },
    ...ownerLookupStages,
    { $project: baseProject },
  ]);
};

export const getLocationFeed = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || DEFAULT_LIMIT, MAX_LIMIT);

    const lat = toNumber(req.query.lat);
    const lng = toNumber(req.query.lng);
    const city = String(req.query.city || "").trim();
    const state = String(req.query.state || "").trim();
    const listingType = String(req.query.listingType || "").trim();
    const manualLocationFilter =
      String(req.query.manualLocationFilter || "") === "true";

    let results = [];
    let similarListings = [];

    if (manualLocationFilter && state) {
      results = await runManualFeedPipeline({
        city,
        state,
        page,
        limit,
        listingType,
      });

      if (page === 1 && city) {
        similarListings = await runManualSimilarPipeline({
          city,
          state,
          limit: 12,
          listingType,
        });
      }
    } else {
      results = await runGeoFeedPipeline({
        lat,
        lng,
        city,
        state,
        page,
        limit,
        listingType,
      });
    }

    const hasMore = results.length > limit;
    const listings = hasMore ? results.slice(0, limit) : results;

    return res.json({
      page,
      limit,
      listings,
      similarListings,
      hasMore,
      nextPage: hasMore ? page + 1 : null,
      meta: {
        mode: manualLocationFilter && state ? "manual" : "geo",
        exactLocationOnly: manualLocationFilter && state,
        selectedCity: city || "",
        selectedState: state || "",
      },
    });
  } catch (error) {
    console.error("getLocationFeed error:", error);
    return res.status(500).json({
      message: error.message || "Failed to load location feed",
    });
  }
};

export const searchListingsByLocation = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || DEFAULT_LIMIT, MAX_LIMIT);

    const q = String(req.query.q || "").trim();
    const category = String(req.query.category || "").trim();
    const subcategory = String(req.query.subcategory || "").trim();
    const city = String(req.query.city || "").trim();
    const state = String(req.query.state || "").trim();
    const listingType = String(req.query.listingType || "").trim();
    const lat = toNumber(req.query.lat);
    const lng = toNumber(req.query.lng);
    const manualLocationFilter =
      String(req.query.manualLocationFilter || "") === "true";

    let results = [];
    let similarListings = [];

    if (manualLocationFilter && state) {
      results = await runManualSearchPipeline({
        q,
        category,
        subcategory,
        city,
        state,
        page,
        limit,
        listingType,
      });

      if (page === 1 && city) {
        similarListings = await runManualSimilarPipeline({
          city,
          state,
          category,
          subcategory,
          q,
          limit: 12,
          listingType,
        });
      }
    } else {
      results = await runGeoSearchPipeline({
        q,
        category,
        subcategory,
        city,
        state,
        lat,
        lng,
        page,
        limit,
        listingType,
      });
    }

    const hasMore = results.length > limit;
    const listings = hasMore ? results.slice(0, limit) : results;

    return res.json({
      page,
      limit,
      listings,
      similarListings,
      hasMore,
      nextPage: hasMore ? page + 1 : null,
      meta: {
        mode: manualLocationFilter && state ? "manual" : "geo",
        exactLocationOnly: manualLocationFilter && state,
        selectedCity: city || "",
        selectedState: state || "",
      },
    });
  } catch (error) {
    console.error("searchListingsByLocation error:", error);
    return res.status(500).json({
      message: error.message || "Failed to search listings by location",
    });
  }
};