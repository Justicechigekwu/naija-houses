import AnalyticsEvent from "../models/analyticsEventModel.js";

const getDateRange = (days = 7) => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);
  return { start, end };
};

export const trackAnalyticsEvent = async (req, res) => {
  try {
    const { eventType, visitorId, listingId, category, subcategory, meta } = req.body;

    if (!eventType || !visitorId) {
      return res.status(400).json({ message: "eventType and visitorId are required" });
    }

    await AnalyticsEvent.create({
      eventType,
      visitorId,
      listingId: listingId || null,
      category: category || null,
      subcategory: subcategory || null,
      userId: req.user?.id || null,
      meta: meta || {},
    });

    res.status(201).json({ message: "Event tracked" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to track analytics event" });
  }
};

export const getAdminAnalyticsOverview = async (req, res) => {
  try {
    const range7 = getDateRange(7);
    const range30 = getDateRange(30);

    const [visitors7, visitors30, topCategories, topSubcategories] = await Promise.all([
      AnalyticsEvent.aggregate([
        {
          $match: {
            eventType: "APP_VISIT",
            createdAt: { $gte: range7.start, $lte: range7.end },
          },
        },
        {
          $group: {
            _id: {
              day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            },
            visitors: { $addToSet: "$visitorId" },
          },
        },
        {
          $project: {
            _id: 0,
            day: "$_id.day",
            count: { $size: "$visitors" },
          },
        },
        { $sort: { day: 1 } },
      ]),

      AnalyticsEvent.aggregate([
        {
          $match: {
            eventType: "APP_VISIT",
            createdAt: { $gte: range30.start, $lte: range30.end },
          },
        },
        {
          $group: {
            _id: {
              day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            },
            visitors: { $addToSet: "$visitorId" },
          },
        },
        {
          $project: {
            _id: 0,
            day: "$_id.day",
            count: { $size: "$visitors" },
          },
        },
        { $sort: { day: 1 } },
      ]),

      AnalyticsEvent.aggregate([
        {
          $match: {
            category: { $ne: null },
            createdAt: { $gte: range30.start, $lte: range30.end },
            eventType: { $in: ["CATEGORY_VIEW", "LISTING_VIEW"] },
          },
        },
        {
          $group: {
            _id: "$category",
            interactions: { $sum: 1 },
          },
        },
        { $sort: { interactions: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            category: "$_id",
            interactions: 1,
          },
        },
      ]),

      AnalyticsEvent.aggregate([
        {
          $match: {
            subcategory: { $ne: null },
            createdAt: { $gte: range30.start, $lte: range30.end },
            eventType: { $in: ["SUBCATEGORY_VIEW", "LISTING_VIEW"] },
          },
        },
        {
          $group: {
            _id: "$subcategory",
            interactions: { $sum: 1 },
          },
        },
        { $sort: { interactions: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            subcategory: "$_id",
            interactions: 1,
          },
        },
      ]),
    ]);

    res.json({
      visitors7,
      visitors30,
      topCategories,
      topSubcategories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to load analytics" });
  }
};