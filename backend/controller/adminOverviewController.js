import userModel from "../models/userModel.js";
import Listing from "../models/listingModels.js";
import Payment from "../models/paymentModel.js";
import Report from "../models/reportModel.js";
import AnalyticsEvent from "../models/analyticsEventModel.js";

export const getAdminOverview = async (req, res) => {
  try {
    const now = new Date();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const [
      totalUsers,
      publishedListings,
      pendingPayments,
      visitorsLast7Days,
      openReports,
      pendingAppeals,
    ] = await Promise.all([
      userModel.countDocuments(),

      Listing.countDocuments({
        publishStatus: "PUBLISHED",
        expiresAt: { $gt: now },
      }),

      Payment.countDocuments({
        status: "PENDING_CONFIRMATION",
      }),

      AnalyticsEvent.aggregate([
        {
          $match: {
            eventType: "APP_VISIT",
            createdAt: { $gte: sevenDaysAgo },
          },
        },
        {
          $group: {
            _id: "$visitorId",
          },
        },
        {
          $count: "total",
        },
      ]),

      Report.countDocuments({ status: "OPEN" }),

      Listing.countDocuments({
        publishStatus: "APPEAL_PENDING",
        appealStatus: "PENDING",
      }),
    ]);

    res.json({
      totalUsers,
      publishedListings,
      pendingPayments,
      visitorsLast7Days: visitorsLast7Days[0]?.total || 0,
      openReports,
      pendingAppeals,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to load overview",
    });
  }
};