import dotenv from "dotenv";
import dbConnect from "../config/databaseConfig.js";
import CategoryPricing from "../models/categoryPricingModel.js";

dotenv.config();
await dbConnect();

const seed = [
  // CATEGORY DEFAULTS
  {
    category: "PROPERTY",
    subcategory: null,
    label: "Property Default",
    publishPrice: 3999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "VEHICLES",
    subcategory: null,
    label: "Vehicles Default",
    publishPrice: 2999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "PHONES",
    subcategory: null,
    label: "Phones Default",
    publishPrice: 1499,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "ELECTRONICS",
    subcategory: null,
    label: "Electronics Default",
    publishPrice: 1499,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },

  // SUBCATEGORY OVERRIDES
  {
    category: "PROPERTY",
    subcategory: "HOUSES_APARTMENTS",
    label: "Houses & Apartments",
    publishPrice: 4999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "PROPERTY",
    subcategory: "LANDS_PLOTS",
    label: "Lands & Plots",
    publishPrice: 4999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "VEHICLES",
    subcategory: "CARS_TRUCKS",
    label: "Cars & Trucks",
    publishPrice: 3999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "PHONES",
    subcategory: "SMART_PHONES",
    label: "Smart Phones",
    publishPrice: 3999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "ELECTRONICS",
    subcategory: "SMART_WATCHES",
    label: "Smart Watches",
    publishPrice: 1999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "ELECTRONICS",
    subcategory: "GAMING_CONSOLES",
    label: "Gaming Consoles",
    publishPrice: 4499,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
];

for (const item of seed) {
  await CategoryPricing.updateOne(
    {
      category: item.category,
      subcategory: item.subcategory,
    },
    {
      $set: {
        ...item,
        isActive: true,
      },
    },
    { upsert: true }
  );
}

console.log("✅ Category & subcategory pricing seeded");
process.exit(0);