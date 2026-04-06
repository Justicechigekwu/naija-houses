import mongoose from "mongoose";

const supportSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
      maxlength: 30,
    },

    address: {
      type: String,
      default: "",
      trim: true,
      maxlength: 250,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },

    status: {
      type: String,
      enum: ["NEW", "IN_PROGRESS", "RESOLVED"],
      default: "NEW",
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      default: null,
    },

    readAt: {
      type: Date,
      default: null,
    },

    repliedAt: {
      type: Date,
      default: null,
    },

    adminReplyNote: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

const Support =
  mongoose.models.Support ||
  mongoose.model("Support", supportSchema);

export default Support;