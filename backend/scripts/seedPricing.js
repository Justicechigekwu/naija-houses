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
    publishPrice: 5999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
  },
  {
    category: "VEHICLES",
    subcategory: null,
    label: "Vehicles Default",
    publishPrice: 4999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
  },
  {
    category: "PHONES",
    subcategory: null,
    label: "Phones Default",
    publishPrice: 2999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
  },
  {
    category: "ELECTRONICS",
    subcategory: null,
    label: "Electronics Default",
    publishPrice: 3499,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
  },

  // SUBCATEGORY OVERRIDES
  {
    category: "PROPERTY",
    subcategory: "HOUSES_APARTMENTS",
    label: "Houses & Apartments",
    publishPrice: 7999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
  },
  {
    category: "PROPERTY",
    subcategory: "LANDS_PLOTS",
    label: "Lands & Plots",
    publishPrice: 9999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
  },
  {
    category: "VEHICLES",
    subcategory: "CARS_TRUCKS",
    label: "Cars & Trucks",
    publishPrice: 6999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
  },
  {
    category: "PHONES",
    subcategory: "SMART_PHONES",
    label: "Smart Phones",
    publishPrice: 3999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
  },
  {
    category: "ELECTRONICS",
    subcategory: "SMART_WATCHES",
    label: "Smart Watches",
    publishPrice: 1999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
  },
  {
    category: "ELECTRONICS",
    subcategory: "GAMING_CONSOLES",
    label: "Gaming Consoles",
    publishPrice: 4499,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
  },
];

for (const item of seed) {
  await CategoryPricing.updateOne(
    {
      category: item.category,
      subcategory: item.subcategory,
    },
    { $set: item },
    { upsert: true }
  );
}

console.log("✅ Category & subcategory pricing seeded");
process.exit(0);