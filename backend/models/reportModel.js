import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    targetType: {
      type: String,
      enum: ["LISTING", "USER"],
      required: true,
    },

    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      default: null,
    },

    targetListing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      default: null,
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
    },

    reason: {
      type: String,
      enum: [
        "SCAM",
        "FAKE_ITEM",
        "FAKE_PRICE",
        "ABUSIVE_BEHAVIOR",
        "SPAM",
        "DUPLICATE",
        "PROHIBITED_ITEM",
        "MISLEADING_INFO",
        "OTHER",
      ],
      required: true,
    },

    message: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: ["OPEN", "REVIEWED", "RESOLVED", "DISMISSED"],
      default: "OPEN",
    },

    adminNote: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

reportSchema.index({ targetType: 1, status: 1, createdAt: -1 });
reportSchema.index({ targetUser: 1 });
reportSchema.index({ targetListing: 1 });
reportSchema.index({ reportedBy: 1 });

const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);

export default Report;
