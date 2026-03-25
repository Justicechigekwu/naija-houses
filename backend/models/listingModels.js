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
      enum: ["Sale", "Rent", "Shortlet"],
      validate: {
        validator: function (value) {
          if (this.subcategory === "HOUSES_APARTMENTS") {
            return ["Sale", "Rent", "Shortlet"].includes(value);
          }

          if (this.subcategory === "LANDS_PLOTS") {
            return value === "Sale";
          }

          if (
            ["VEHICLES", "ELECTRONICS", "HOME", "FASHION"].includes(this.category)
          ) {
            return value === "Sale";
          }

          return true;
        },
        message: "Invalid listing type for this category",
      },
      required: [
        function () {
          return this.publishStatus !== "DRAFT";
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

    location: {
      type: String,
      required: [
        function () {
          return this.publishStatus !== "DRAFT";
        },
        "Please enter a location",
      ],
      trim: true,
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
      enum: ["Owner", "Agent", "Dealer", "Seller"],
      required: [
        function () {
          return this.publishStatus !== "DRAFT";
        },
        "Please select who is posting this listing",
      ],
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
        "ELECTRONICS",
        "PHONES",
        "HOME",
        "FASHION",
        "BABY",
        "SPORTS_FITNESS",
        "AGRICULTURE",
        "FOOD",
        "PETS_ANIMALS",
        "TOYS_GAMES",
      ],
      required: true,
      default: "PROPERTY",
    },

    subcategory: {
      type: String,
      enum: [
        "CARS_TRUCKS",
        "MOTORCYCLES",
        "BICYCLES",
        "TRAILERS",
        "CAR_PARTS_ACCESSORIES",
        "HOUSES_APARTMENTS",
        "LANDS_PLOTS",
        "TABLETS",
        "SMART_PHONES",
        "MOBILE_ACCESSORIES",
        "LAPTOPS_COMPUTERS",
        "TELEVISIONS",
        "HEADPHONES",
        "SMART_WATCHES",
        "GAMING_CONSOLES",
        "ELECTRONICS_OTHER",
        "AUDIO_MUSIC_EQUIPMENT",
        "CAMERAS_PHOTOGRAPHY",
        "TV_EQUIPMENT",
        "NETWORKING_EQUIPMENT",
        "COMPUTER_MONITORS",
        "COMPUTER_ACCESSORIES",
        "CCTV_SECURITY_CAMERAS",
        "FURNITURE",
        "HOME_APPLIANCES",
        "WATCHES",
        "CLOTHING",
        "FOOTWEAR",
        "BAGS",
        "JEWELRY",
        "HATS_CAPS",
        "SUNGLASSES",
        "BELTS",
        "WALLETS",
        "BABY_CLOTHING",
        "BABY_GEAR",
        "BABY_FEEDING",
        "GYM_EQUIPMENT",
        "SPORTS_EQUIPMENT",
        "FITNESS_ACCESSORIES",
        "FARM_MACHINERY",
        "FARM_TOOLS",
        "FARM_PRODUCE",
        "CEREALS_GRAINS",
        "PACKAGED_FOODS",
        "DOGS",
        "CATS",
        "PET_ACCESSORIES",
        "KIDS_TOYS",
        "BOARD_GAMES",
      ],
      required: true,
      default: "HOUSES_APARTMENTS",
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
listingSchema.index({ autoDeleteAt: 1 }, { expireAfterSeconds: 0 });

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;