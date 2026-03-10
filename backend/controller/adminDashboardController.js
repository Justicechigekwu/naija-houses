import userModel from "../models/userModel.js";
import Listing from "../models/listingModels.js";

export const usersWithListing = async (req, res) => {
  try {
    const now = new Date();

    const counts = await Listing.aggregate([
      {
        $group: {
          _id: "$owner",
          total: { $sum: 1 },
          awaitingPayment: { $sum: { $cond: [{ $eq: ["$publishStatus", "AWAITING_PAYMENT"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$publishStatus", "PENDING_CONFIRMATION"] }, 1, 0] } },
          published: { $sum: { $cond: [{ $eq: ["$publishStatus", "PUBLISHED"] }, 1, 0] } },
          expired: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$publishStatus", "EXPIRED"] },
                    { $and: [{ $eq: ["$publishStatus", "PUBLISHED"] }, { $lte: ["$expiresAt", now] }] },
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
                { $and: [{ $eq: ["$publishStatus", "PUBLISHED"] }, { $gt: ["$expiresAt", now] }] },
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

export const listingsForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const listings = await Listing.find({ owner: userId })
      .sort({ createdAt: -1 })
      .populate("owner", "firstName lastName email avatar");

    const now = new Date();
    res.json(
      listings.map((l) => {
        const isExpired = l.expiresAt ? l.expiresAt <= now : false;
        const daysLeft = l.expiresAt
          ? Math.ceil((l.expiresAt - now) / (1000 * 60 * 60 * 24))
          : null;

        return { ...l.toObject(), isExpired, daysLeft };
      })
    );
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to load user listings" });
  }
};