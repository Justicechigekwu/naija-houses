import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "LISTING_APPROVED",
        "LISTING_REJECTED",
        "LISTING_EXPIRED",
        "LISTING_EXPIRING_SOON",
        "PAYMENT_CONFIRMED",
        "PAYMENT_REJECTED",
        "REVIEW_RECEIVED",
        "REVIEW_REPLY",
        "DRAFT_REMINDER",

        "LISTING_REMOVED_BY_ADMIN",
        "LISTING_APPEAL_SUBMITTED",
        "LISTING_APPEAL_APPROVED",
        "LISTING_APPEAL_REJECTED",
        "SYSTEM",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;