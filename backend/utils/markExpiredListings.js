import Listing from "../models/listingModels.js";
import Notification from "../models/notificationModel.js";
import {
  emitListingUpdated,
  emitNotificationToUser,
  emitUnreadNotificationCount,
} from "../service/realtimeService.js";

const markExpiredListings = async (userId = null) => {
  const now = new Date();

  const query = {
    publishStatus: "PUBLISHED",
    expiresAt: { $ne: null, $lte: now },
  };

  if (userId) {
    query.owner = userId;
  }

  const listings = await Listing.find(query);

  for (const listing of listings) {
    listing.publishStatus = "EXPIRED";
    listing.expiredAt = now;

    if (!listing.autoDeleteAt) {
      listing.autoDeleteAt = new Date(
        now.getTime() + 60 * 24 * 60 * 60 * 1000
      );
    }

    await listing.save();

    emitListingUpdated(listing.owner.toString(), {
      listingId: listing._id,
      publishStatus: listing.publishStatus,
      expiredAt: listing.expiredAt,
      expiresAt: listing.expiresAt,
      autoDeleteAt: listing.autoDeleteAt,
    });

    const existingNotification = await Notification.findOne({
      user: listing.owner,
      type: "LISTING_EXPIRED",
      listing: listing._id,
    });

    if (!existingNotification) {
      const notification = await Notification.create({
        user: listing.owner,
        type: "LISTING_EXPIRED",
        title: "Your listing has expired",
        message: "Would you like to renew it? Tap to open your expired listings.",
        listing: listing._id,
        metadata: {
          route: "/expired",
          action: "OPEN_EXPIRED_PAGE",
          publishStatus: listing.publishStatus,
          expiredAt: listing.expiredAt,
          expiresAt: listing.expiresAt,
        },
      });

      const populatedNotification = await Notification.findById(notification._id)
        .populate("listing", "title images category subcategory publishStatus");

      emitNotificationToUser(listing.owner.toString(), populatedNotification);

      const unreadCount = await Notification.countDocuments({
        user: listing.owner,
        isRead: false,
      });

      emitUnreadNotificationCount(listing.owner.toString(), unreadCount);
    }
  }
};

export default markExpiredListings;