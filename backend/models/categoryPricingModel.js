import mongoose from "mongoose";

const categoryPricingSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    subcategory: {
      type: String,
      default: null,
      uppercase: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    publishPrice: {
      type: Number,
      required: true,
    },
    trialDays: {
      type: Number,
      default: 14,
    },
    paidDays: {
      type: Number,
      default: 30,
    },
    trialEnabled: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

categoryPricingSchema.index(
  { category: 1, subcategory: 1 },
  { unique: true }
);

const CategoryPricing =
  mongoose.models.CategoryPricing ||
  mongoose.model("CategoryPricing", categoryPricingSchema);

export default CategoryPricing;