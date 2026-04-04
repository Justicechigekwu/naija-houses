
import userModel from "../models/userModel.js";
import Listing from "../models/listingModels.js";
import markExpiredListings from "../utils/markExpiredListings.js";

export const usersWithListing = async (req, res) => {
  console.log("Admin users controller hit");
  try {
    await markExpiredListings();

    const now = new Date();

    const counts = await Listing.aggregate([
      {
        $group: {
          _id: "$owner",
          total: { $sum: 1 },
          awaitingPayment: {
            $sum: {
              $cond: [{ $eq: ["$publishStatus", "AWAITING_PAYMENT"] }, 1, 0],
            },
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ["$publishStatus", "PENDING_CONFIRMATION"] }, 1, 0],
            },
          },
          published: {
            $sum: {
              $cond: [{ $eq: ["$publishStatus", "PUBLISHED"] }, 1, 0],
            },
          },
          expired: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$publishStatus", "EXPIRED"] },
                    {
                      $and: [
                        { $eq: ["$publishStatus", "PUBLISHED"] },
                        { $lte: ["$expiresAt", now] },
                      ],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
          active: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$publishStatus", "PUBLISHED"] },
                    { $gt: ["$expiresAt", now] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const map = new Map(counts.map((c) => [String(c._id), c]));

    const users = await userModel
      .find({}, "firstName lastName email avatar createdAt")
      .sort({ createdAt: -1 });

    res.json(
      users.map((u) => {
        const c = map.get(String(u._id)) || {};
        return {
          id: u._id,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          avatar: u.avatar || null,
          createdAt: u.createdAt,
          badges: {
            total: c.total || 0,
            active: c.active || 0,
            pending: c.pending || 0,
            awaitingPayment: c.awaitingPayment || 0,
            expired: c.expired || 0,
          },
        };
      })
    );
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to load users" });
  }
};

export const getAdminUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    await markExpiredListings(userId);

    const user = await userModel.findById(
      userId,
      "firstName lastName email avatar createdAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const now = new Date();

    const counts = await Listing.aggregate([
      {
        $match: {
          owner: user._id,
        },
      },
      {
        $group: {
          _id: "$owner",
          total: { $sum: 1 },
          awaitingPayment: {
            $sum: {
              $cond: [{ $eq: ["$publishStatus", "AWAITING_PAYMENT"] }, 1, 0],
            },
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ["$publishStatus", "PENDING_CONFIRMATION"] }, 1, 0],
            },
          },
          expired: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$publishStatus", "EXPIRED"] },
                    {
                      $and: [
                        { $eq: ["$publishStatus", "PUBLISHED"] },
                        { $lte: ["$expiresAt", now] },
                      ],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
          active: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$publishStatus", "PUBLISHED"] },
                    { $gt: ["$expiresAt", now] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const c = counts[0] || {};

    res.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar || null,
      createdAt: user.createdAt,
      badges: {
        total: c.total || 0,
        active: c.active || 0,
        pending: c.pending || 0,
        awaitingPayment: c.awaitingPayment || 0,
        expired: c.expired || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to load user details" });
  }
};

export const listingsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { filter = "all" } = req.query;

    await markExpiredListings(userId);

    const now = new Date();

    const query = { owner: userId };

    if (filter === "active") {
      query.publishStatus = "PUBLISHED";
      query.expiresAt = { $gt: now };
    }

    if (filter === "pending") {
      query.publishStatus = "PENDING_CONFIRMATION";
    }

    if (filter === "awaiting") {
      query.publishStatus = "AWAITING_PAYMENT";
    }

    if (filter === "removed") {
      query.publishStatus = "REMOVED_BY_ADMIN";
    }

    if (filter === "appeal_pending") {
      query.publishStatus = "APPEAL_PENDING";
    }

    const listings = await Listing.find(query)
      .sort({ createdAt: -1 })
      .populate("owner", "firstName lastName email avatar");

    res.json(
      listings.map((l) => {
        const isExpired =
          l.publishStatus === "EXPIRED" || (l.expiresAt ? l.expiresAt <= now : false);

        const daysLeft =
          l.expiresAt && l.expiresAt > now
            ? Math.ceil((l.expiresAt - now) / (1000 * 60 * 60 * 24))
            : 0;

        return {
          ...l.toObject(),
          isExpired,
          daysLeft,
        };
      })
    );
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to load user listings" });
  }
};