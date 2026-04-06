import dotenv from "dotenv";
import dbConnect from "../config/databaseConfig.js";
import CategoryPricing from "../models/categoryPricingModel.js";

dotenv.config();
await dbConnect();

const seed = [
  // =========================
  // CATEGORY DEFAULTS
  // =========================
  {
    category: "PROPERTY",
    subcategory: null,
    label: "Property Default",
    publishPrice: 3499,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "LAND",
    subcategory: null,
    label: "Land Default",
    publishPrice: 3499,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "VEHICLES",
    subcategory: null,
    label: "Vehicles Default",
    publishPrice: 2499,
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
    publishPrice: 1999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "HOME",
    subcategory: null,
    label: "Home Default",
    publishPrice: 1599,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "BABY",
    subcategory: null,
    label: "Baby Default",
    publishPrice: 1799,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "SPORTS_FITNESS",
    subcategory: null,
    label: "Sports & Fitness Default",
    publishPrice: 1999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "AGRICULTURE",
    subcategory: null,
    label: "Agriculture Default",
    publishPrice: 1999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "FOOD",
    subcategory: null,
    label: "Food Default",
    publishPrice: 1999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "PETS_ANIMALS",
    subcategory: null,
    label: "Pets Default",
    publishPrice: 1999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "TOYS_GAMES",
    subcategory: null,
    label: "Toys Default",
    publishPrice: 1999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "FASHION",
    subcategory: null,
    label: "Fashion Default",
    publishPrice: 1999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },

  // =========================
  // PROPERTY OVERRIDES
  // =========================
  {
    category: "PROPERTY",
    subcategory: "HOUSE",
    label: "House",
    publishPrice: 3499,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "PROPERTY",
    subcategory: "APARTMENT",
    label: "Apartment",
    publishPrice: 3499,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "PROPERTY",
    subcategory: "DUPLEX",
    label: "Duplex",
    publishPrice: 3999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "PROPERTY",
    subcategory: "MANSION",
    label: "Mansion",
    publishPrice: 6999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: false,
    isActive: true,
  },
  {
    category: "PROPERTY",
    subcategory: "SHOP",
    label: "Shop",
    publishPrice: 4999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "PROPERTY",
    subcategory: "OFFICE_SPACE",
    label: "Office Space",
    publishPrice: 4999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "PROPERTY",
    subcategory: "WAREHOUSE",
    label: "Warehouse",
    publishPrice: 5999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: false,
    isActive: true,
  },
  {
    category: "PROPERTY",
    subcategory: "FACTORY",
    label: "Factory",
    publishPrice: 6999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: false,
    isActive: true,
  },
  {
    category: "PROPERTY",
    subcategory: "HOTEL",
    label: "Hotel",
    publishPrice: 6999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: false,
    isActive: true,
  },
  {
    category: "PROPERTY",
    subcategory: "EVENT_CENTER",
    label: "Event Center",
    publishPrice: 7999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: false,
    isActive: true,
  },
  {
    category: "PROPERTY",
    subcategory: "COMMERCIAL_BUILDING",
    label: "Commercial Building",
    publishPrice: 7999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: false,
    isActive: true,
  },

  // =========================
  // LAND OVERRIDES
  // =========================
  {
    category: "LAND",
    subcategory: "RESIDENTIAL_PLOT",
    label: "Residential Plot",
    publishPrice: 3499,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "LAND",
    subcategory: "COMMERCIAL_PLOT",
    label: "Commercial Plot",
    publishPrice: 4999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "LAND",
    subcategory: "INDUSTRIAL_LAND",
    label: "Industrial Land",
    publishPrice: 6999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: false,
    isActive: true,
  },

  // =========================
  // VEHICLE OVERRIDES
  // =========================
  {
    category: "VEHICLES",
    subcategory: "CARS",
    label: "Cars",
    publishPrice: 2499,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "VEHICLES",
    subcategory: "TRUCKS_TRAILERS",
    label: "Trucks & Trailers",
    publishPrice: 2499,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },

  // =========================
  // PHONES OVERRIDES
  // =========================
  {
    category: "PHONES",
    subcategory: "SMART_PHONES",
    label: "Smart Phones",
    publishPrice: 1499,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },
  {
    category: "PHONES",
    subcategory: "SMART_WATCHES",
    label: "Smart Watches",
    publishPrice: 1999,
    trialDays: 14,
    paidDays: 30,
    trialEnabled: true,
    isActive: true,
  },

  // =========================
  // ELECTRONICS OVERRIDES
  // =========================
  {
    category: "ELECTRONICS",
    subcategory: "GAMING_CONSOLES",
    label: "Gaming Consoles",
    publishPrice: 1999,
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