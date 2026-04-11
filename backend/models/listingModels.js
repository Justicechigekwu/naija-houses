import mongoose from "mongoose";

const pointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true,
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
      default: [0, 0],
      validate: {
        validator: function (value) {
          return (
            Array.isArray(value) &&
            value.length === 2 &&
            typeof value[0] === "number" &&
            typeof value[1] === "number"
          );
        },
        message: "Geo coordinates must be [lng, lat]",
      },
    },
  },
  { _id: false }
);

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [
        function () {
          return this.publishStatus !== "DRAFT";
        },
        "Please enter a title for the listing",
      ],
    },

    listingType: {
      type: String,
      enum: ["Sale", "Rent", "Shortlet", null, ""],
      validate: {
        validator: function (value) {
          if (["PROPERTY", "LAND"].includes(this.category)) {
            if (!value) return false;
    
            if (this.category === "PROPERTY") {
              return ["Sale", "Rent", "Shortlet"].includes(value);
            }
    
            if (this.category === "LAND") {
              return value === "Sale";
            }
          }
    
          return value == null || value === "";
        },
        message: "Invalid listing type for this category",
      },
      required: [
        function () {
          return (
            this.publishStatus !== "DRAFT" &&
            ["PROPERTY", "LAND"].includes(this.category)
          );
        },
        "Please select listing type",
      ],
    },


    price: {
      type: Number,
      required: [
        function () {
          return this.publishStatus !== "DRAFT";
        },
        "Please enter a price",
      ],
    },

    state: {
      type: String,
      required: [
        function () {
          return this.publishStatus !== "DRAFT";
        },
        "Please enter a state",
      ],
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    // NEW: coordinates for geospatial queries
    geo: {
      type: pointSchema,
      required: false,
      default: undefined,
    },

    // optional normalized fields for faster exact comparisons
    cityNormalized: {
      type: String,
      default: "",
      index: true,
    },

    stateNormalized: {
      type: String,
      default: "",
      index: true,
    },

    description: {
      type: String,
      trim: true,
      required: [
        function () {
          return this.publishStatus !== "DRAFT";
        },
        "Please describe this listing",
      ],
    },

    images: {
      type: [
        {
          url: { type: String, required: true },
          public_id: { type: String, required: true },
        },
      ],
      default: [],
    },

    postedBy: {
      type: String,
      enum: ["Owner", "Agent", "Dealer", "Seller", null, ""],
      required: [
        function () {
          return (
            this.publishStatus !== "DRAFT" &&
            ["PROPERTY", "LAND", "VEHICLES"].includes(this.category)
          );
        },
        "Please select who is posting this listing",
      ],
      validate: {
        validator: function (value) {
          if (["PROPERTY", "LAND", "VEHICLES"].includes(this.category)) {
            return ["Owner", "Agent", "Dealer", "Seller"].includes(value);
          }
    
          return value == null || value === "";
        },
        message: "Invalid postedBy value for this category",
      },
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
    },

    publishStatus: {
      type: String,
      enum: [
        "DRAFT",
        "AWAITING_PAYMENT",
        "PENDING_CONFIRMATION",
        "PUBLISHED",
        "EXPIRED",
        "REJECTED",
        "REMOVED_BY_ADMIN",
        "APPEAL_PENDING",
      ],
      default: "DRAFT",
    },

    category: {
      type: String,
      enum: [
        "VEHICLES",
        "PROPERTY",
        "LAND",
        "ELECTRONICS",
        "PHONES",
        "HOME",
        "BEAUTY_PERSONAL_CARE",
        "FASHION",
        "BABY",
        "KIDS",
        "BOOKS_EDUCATION",
        "SPORTS_FITNESS",
        "AGRICULTURE",
        "FOOD",
        "PETS_ANIMALS",
        "TOYS_GAMES",
        "SERVICES",
        "JOBS",
        "INDUSTRIAL_TOOLS",
      ],
      required: true,
      default: "PROPERTY",
    },


    subcategory: {
      type: String,
      enum: [
        // VEHICLES
        "CARS",
        "TRUCKS",
        "BOATS",
        "BUSES",
        "MOTORCYCLES",
        "BICYCLES",
        "TRAILERS",
        "CAR_PARTS_ACCESSORIES",
    
        // PROPERTY (Residential)
        "HOUSE",
        "APARTMENT",
        "FLAT",
        "MINI_FLAT",
        "SELF_CONTAIN",
        "STUDIO_APARTMENT",
        "DUPLEX",
        "BUNGALOW",
        "TERRACE",
        "SEMI_DETACHED",
        "DETACHED_HOUSE",
        "MANSION",
        "PENTHOUSE",
        "TOWNHOUSE",
        "VILLA",
        "COTTAGE",
        "FARM_HOUSE",
    
        // PROPERTY (Commercial)
        "OFFICE_SPACE",
        "SHOP",
        "WAREHOUSE",
        "FACTORY",
        "SCHOOL_BUILDING",
        "HOSPITAL_BUILDING",
        "HOTEL",
        "GUEST_HOUSE",
        "EVENT_CENTER",
        "COMMERCIAL_BUILDING",
    
        // LAND
        "RESIDENTIAL_PLOT",
        "COMMERCIAL_PLOT",
        "INDUSTRIAL_LAND",
        "AGRICULTURAL_LAND",
        "MIXED_USE_LAND",
    
        // PHONES
        "SMART_PHONES",
        "TABLETS",
        "BUTTON_PHONES",
        "SMART_WATCHES",
        "MOBILE_ACCESSORIES",
        "SMART_WATCHES",
    
        // ELECTRONICS
        "LAPTOPS_COMPUTERS",
        "TELEVISIONS",
        "HEADPHONES",
        "GAMING_CONSOLES",
        "AUDIO_MUSIC_EQUIPMENT",
        "CAMERAS_PHOTOGRAPHY",
        "TV_EQUIPMENT",
        "NETWORKING_EQUIPMENT",
        "COMPUTER_MONITORS",
        "COMPUTER_ACCESSORIES",
        "CCTV_SECURITY_CAMERAS",
        "ELECTRONICS_OTHER",
    
        // HOME
        "FURNITURE",
        "HOME_APPLIANCES",
        "HOME_DECOR",
        "KITCHEN_DINING",
        "BEDDING",
        "LIGHTING",
        "BATHROOM_SUPPLIES",
        "CLEANING_SUPPLIES",
        "OUTDOOR_GARDEN",
        "HOME_IMPROVEMENT",
        "HOME_SECURITY",
        "HOME_OFFICE",
        "STORAGE_ORGANIZATION",
        "CURTAINS_BLINDS",
        "MATTRESSES",
    
        // FASHION
        "WATCHES",
        "CLOTHING",
        "FOOTWEAR",
        "BAGS",
        "JEWELRY",
        "HATS_CAPS",
        "SUNGLASSES",
        "BELTS",
        "WALLETS",

        // BEAUTY & PERSONAL CARE
        "SKINCARE",
        "HAIR_PRODUCTS",
        "MAKEUP",
        "PERFUMES",
        "SALON_EQUIPMENT",
        "HAIR_EXTENSIONS_WIGS",
        "NAILS",
        "PERSONAL_CARE",
        "BEAUTY_TOOLS",
    
        // BABY
        "BABY_CLOTHING",
        "BABY_GEAR",
        "BABY_FEEDING",
    
        // SPORTS & FITNESS
        "GYM_EQUIPMENT",
        "SPORTS_EQUIPMENT",
        "FITNESS_ACCESSORIES",
        "EXERCISE_MACHINES",
        "OUTDOOR_SPORTS",
        "TEAM_SPORTS",
        "RACQUET_SPORTS",
        "COMBAT_SPORTS",
        "WATER_SPORTS_SWIMMING",
        "SPORTSWEAR",
        "SPORTS_SHOES",
    
        // AGRICULTURE
        "FARM_MACHINERY",
        "FARM_TOOLS",
        "FARM_PRODUCE",
        "SEEDS_SEEDLINGS",
        "FERTILIZERS_SOIL_IMPROVERS",
        "PESTICIDES_HERBICIDES",
        "IRRIGATION_WATERING",
        "ANIMAL_FEED_SUPPLEMENTS",
        "POULTRY_FISHING_EQUIPMENT",
        "POULTRY_FISHING_EQUIPMENT",
        "LIVESTOCK_AGRIC_ANIMALS",
        "STORAGE_PROCESSING",
    
        // FOOD
        "CEREALS_GRAINS",
        "PACKAGED_FOODS",
        "BEVERAGES",
        "FRESH_FOOD",
        "MEAT_SEAFOOD",
        "DAIRY_PRODUCTS",
        "BAKERY",
        "COOKING_INGREDIENTS",
        "FROZEN_FOODS",
        "BABY_FOOD",
        "CONDIMENTS_SAUCES",
        "SWEETS_CONFECTIONERY",
        "BULK_FOOD_SUPPLIES",
    
        // PETS & ANIMALS
        "DOGS",
        "CATS",
        "BIRDS",
        "FISH_AQUATICS",
        "RABBITS_SMALL_PETS",
        "LIVESTOCK",
        "PET_FOOD",
        "PET_ACCESSORIES",
        "PET_HEALTH_GROOMING",
    
        // TOYS & GAMES
        "KIDS_TOYS",
        "BOARD_GAMES",
        "EDUCATIONAL_STEM_TOYS",
        "ELECTRONIC_TOYS",
        "OUTDOOR_PLAY",
        "RC_TOYS",
        "PUZZLES_BRAIN_GAMES",
        "VIDEO_GAMES_ACCESSORIES",
        "COLLECTIBLES_HOBBIES",
        "PARTY_GAMES",

        // KIDS
        "TOYS",
        "EDUCATIONAL_MATERIALS",
        "SCHOOL_BAGS",
        "KIDS_FURNITURE",

        // BOOKS & EDUCATION
        "BOOKS",
        "TEXTBOOKS",
        "COURSES",
        "STUDY_MATERIALS",
    
        // SERVICES
        "HOME_SERVICES",
        "BEAUTY_SERVICES",
        "TECH_SERVICES",
        "EVENT_SERVICES",
        "AUTOMOTIVE_SERVICES",
        "BUSINESS_SERVICES",
        "CONSTRUCTION_SERVICES",
        "DELIVERY_LOGISTICS",
    
        // JOBS
        "DOMESTIC_HELP",
        "BEAUTY_FASHION_WORKERS",
        "HOSPITALITY_FOOD_WORKERS",
        "CAREGIVERS_NANNIES",
        "DRIVERS_LOGISTICS",
        "ARTISANS_TECHNICIANS",
        "OFFICE_ADMIN_SUPPORT",
        "SALES_RETAIL_WORKERS",
        "SECURITY_WORKERS",
        "DIGITAL_FREELANCE",
    
        // INDUSTRIAL TOOLS
        "POWER_TOOLS",
        "HAND_TOOLS",
        "WELDING_EQUIPMENT",
        "ELECTRICAL_TOOLS",
        "GENERATORS",
        "PLUMBING_TOOLS",
        "CONSTRUCTION_EQUIPMENT",
        "SAFETY_EQUIPMENT",
        "GENERATORS_POWER_EQUIPMENT",
        "MEASURING_TESTING_TOOLS",
        "SOLAR_POWER",
        "INVERTERS_BATTERIES",
        "SEWING_MACHINES",
        "INDUSTRIAL_MACHINERY",
        "TOOL_STORAGE_WORKSHOP",
      ],
      required: true,
      default: "HOUSE",
    },

    attributes: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    publishPlan: {
      type: String,
      enum: ["TRIAL_14_DAYS", "PAID_30_DAYS"],
      default: null,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    adminRemovedAt: {
      type: Date,
      default: null,
    },

    adminRemovalReason: {
      type: String,
      default: "",
    },

    violationPolicy: {
      type: String,
      enum: [
        "PROHIBITED_ITEMS",
        "COMMUNITY_GUIDELINES",
        "TERMS",
        "FRAUD_SAFETY",
        "OTHER",
      ],
      default: "OTHER",
    },

    appealStatus: {
      type: String,
      enum: ["NONE", "PENDING", "APPROVED", "REJECTED"],
      default: "NONE",
    },

    appealMessage: {
      type: String,
      default: "",
    },

    appealSubmittedAt: {
      type: Date,
      default: null,
    },

    appealExpiresAt: {
      type: Date,
      default: null,
    },

    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },

    appealReviewedAt: {
      type: Date,
      default: null,
    },

    appealReviewNote: {
      type: String,
      default: "",
    },

    isArchivedByAdmin: {
      type: Boolean,
      default: false,
    },

    draftReminderAt: {
      type: Date,
      default: null,
    },

    draftReminderSentAt: {
      type: Date,
      default: null,
    },

    expiredAt: {
      type: Date,
      default: null,
    },

    rejectionType: {
      type: String,
      enum: ["NONE", "PAYMENT", "LISTING", "PROHIBITED"],
      default: "NONE",
    },
    
    rejectionReason: {
      type: String,
      default: "",
      trim: true,
    },
    
    rejectedAt: {
      type: Date,
      default: null,
    },

    autoDeleteAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

listingSchema.pre("save", function (next) {
  this.cityNormalized = String(this.city || "").trim().toLowerCase();
  this.stateNormalized = String(this.state || "").trim().toLowerCase();
  next();
});


listingSchema.index({ geo: "2dsphere" });
listingSchema.index({ category: 1, subcategory: 1, createdAt: -1 });
listingSchema.index({ publishStatus: 1, expiresAt: 1 });
listingSchema.index({ cityNormalized: 1, stateNormalized: 1, createdAt: -1 });
// listingSchema.index({ autoDeleteAt: 1 }, { expireAfterSeconds: 0 });

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;