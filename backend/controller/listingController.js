import { generateUniqueListingSlug } from "../utils/listingSlug.js";
import Listing from "../models/listingModels.js";
import markExpiredListings from "../utils/markExpiredListings.js";
import cloudinary from "../config/cloudinaryConfig.js";
import userModel from "../models/userModel.js";
import { scheduleDraftReminder } from "../utils/scheduleDraftReminder.js";
import { geocodeAddress } from "../utils/geocodeAddress.js";

export const createListing = async (req, res) => {
  try {
    const imagePaths = req.files
      ? req.files.map((file) => ({
          url: file.path,
          public_id: file.filename,
        }))
      : [];

    const price = Number(String(req.body.price).replace(/[^\d]/g, ""));

    const locationPayload = {
      city: req.body.city || "",
      state: req.body.state || "",
    };

    const geo = await geocodeAddress(locationPayload);

    const category = String(req.body.category || "PROPERTY").toUpperCase();
    const subcategory = String(req.body.subcategory || "").toUpperCase();

    const normalizedListingType =
      ["PROPERTY", "LAND"].includes(category)
        ? req.body.listingType || null
        : null;

    const normalizedPostedBy =
      ["PROPERTY", "LAND", "VEHICLES"].includes(category)
        ? req.body.postedBy || null
        : null;

    const slug = await generateUniqueListingSlug(Listing, {
      title: req.body.title,
      city: locationPayload.city,
      state: locationPayload.state,
    });

    const newListing = new Listing({
      title: req.body.title,
      slug,
      listingType: normalizedListingType,
      price,
      state: locationPayload.state,
      city: locationPayload.city,
      stateNormalized: String(locationPayload.state || "").trim().toLowerCase(),
      cityNormalized: String(locationPayload.city || "").trim().toLowerCase(),
      geo: geo || undefined,
      description: req.body.description,
      postedBy: normalizedPostedBy,
      owner: req.user.id,
      images: imagePaths,
      publishStatus: "DRAFT",
      publishPlan: null,
      publishedAt: null,
      expiresAt: null,
      category,
      subcategory,
      attributes: req.body.attributes ? JSON.parse(req.body.attributes) : {},
    });

    scheduleDraftReminder(newListing, 30);

    await newListing.save();

    res.status(201).json({
      message: "Listing created. Pay to publish.",
      listingId: newListing._id,
      listing: newListing,
    });
  } catch (error) {
    console.error("Error in createListing:", error);
    res.status(500).json({ message: error.message || "Failed to create listing" });
  }
};

export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this listing" });
    }

    delete req.body.publishStatus;
    delete req.body.publishPlan;
    delete req.body.publishedAt;
    delete req.body.expiresAt;
    delete req.body.owner;
    delete req.body.location;

    if (
      listing.publishStatus === "PUBLISHED" &&
      (
        (req.body.category && req.body.category !== listing.category) ||
        (req.body.subcategory && req.body.subcategory !== listing.subcategory)
      )
    ) {
      return res.status(400).json({
        message: "Category and subcategory cannot be changed after publication",
      });
    }

    let keepImages = [];
    if (req.body.keepImages) {
      if (Array.isArray(req.body.keepImages)) {
        keepImages = req.body.keepImages.map((img) =>
          typeof img === "string" ? JSON.parse(img) : img
        );
      } else {
        keepImages = [
          typeof req.body.keepImages === "string"
            ? JSON.parse(req.body.keepImages)
            : req.body.keepImages,
        ];
      }
    }

    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    const removedImages = listing.images.filter(
      (oldImg) => !keepImages.some((kept) => kept.public_id === oldImg.public_id)
    );

    if (removedImages.length) {
      await Promise.all(
        removedImages.map((img) => cloudinary.uploader.destroy(img.public_id))
      );
    }

    const updatedImages = [...keepImages, ...newImages];

    const nextTitle = req.body.title || listing.title;
    const nextCity = req.body.city ?? listing.city;
    const nextState = req.body.state ?? listing.state;

    const nextSlug = await generateUniqueListingSlug(
      Listing,
      {
        title: nextTitle,
        city: nextCity,
        state: nextState,
      },
      listing._id
    );

    let nextGeo = listing.geo;
    const locationChanged =
      nextCity !== listing.city || nextState !== listing.state;

    if (locationChanged) {
      nextGeo = await geocodeAddress({
        city: nextCity,
        state: nextState,
      });
    }

    const nextCategory = String(req.body.category || listing.category || "").toUpperCase();
    const nextSubcategory = String(
      req.body.subcategory || listing.subcategory || ""
    ).toUpperCase();

    const normalizedListingType =
      ["PROPERTY", "LAND"].includes(nextCategory)
        ? req.body.listingType || listing.listingType || null
        : null;

    const normalizedPostedBy =
      ["PROPERTY", "LAND", "VEHICLES"].includes(nextCategory)
        ? req.body.postedBy || listing.postedBy || null
        : null;

    const updates = {
      title: nextTitle,
      slug: nextSlug,
      listingType: normalizedListingType,
      price: req.body.price
        ? Number(String(req.body.price).replace(/[^\d]/g, ""))
        : listing.price,
      city: nextCity,
      state: nextState,
      stateNormalized: String(nextState || "").trim().toLowerCase(),
      cityNormalized: String(nextCity || "").trim().toLowerCase(),
      geo: nextGeo || listing.geo,
      description: req.body.description || listing.description,
      postedBy: normalizedPostedBy,
      images: updatedImages,
      attributes: req.body.attributes
        ? JSON.parse(req.body.attributes)
        : listing.attributes,
    };

    if (listing.publishStatus === "DRAFT") {
      updates.category = nextCategory;
      updates.subcategory = nextSubcategory;
      updates.draftReminderAt = new Date(Date.now() + 1 * 60 * 1000);
      updates.draftReminderSentAt = null;
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedListing);
  } catch (error) {
    console.error("updateListing error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to update listing" });
  }
};




export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this listing" });
    }

    if (listing.images?.length) {
      await Promise.all(
        listing.images.map((img) => cloudinary.uploader.destroy(img.public_id))
      );
    }

    await userModel.updateMany(
      { favorites: listing._id },
      { $pull: { favorites: listing._id } }
    );

    await listing.deleteOne();

    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete listing" });
  }
};

export const getLitsing = async (req, res) => {
  try {
    const {
      search,
      state,
      city,
      category,
      subcategory,
      listingType,
    } = req.query;

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const skip = (page - 1) * limit;

    const filter = {};
    const now = new Date();

    await markExpiredListings();

    filter.publishStatus = "PUBLISHED";

    const and = [
      {
        $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
      },
    ];

    if (search) {
      and.push({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { state: { $regex: search, $options: "i" } },
          { city: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      });
    }

    if (and.length) filter.$and = and;

    if (state) filter.state = { $regex: state, $options: "i" };
    if (city) filter.city = { $regex: city, $options: "i" };
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (listingType) filter.listingType = listingType;

    const listings = await Listing.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit + 1)
      .lean();

    const hasMore = listings.length > limit;
    const items = hasMore ? listings.slice(0, limit) : listings;

    res.status(200).json({
      items,
      page,
      limit,
      hasMore,
      nextPage: hasMore ? page + 1 : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Failed to fetch listings" });
  }
};

export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("owner", "firstName lastName avatar slug");

    if (!listing) return res.status(404).json({ message: "Listing not found" });

    const isOwner = req.user && String(listing.owner?._id || listing.owner) === String(req.user.id);

    if (listing.publishStatus !== "PUBLISHED" && !isOwner) {
      return res.status(403).json({ message: "Listing not published" });
    }

    const now = new Date();
    const isExpired = listing.expiresAt && listing.expiresAt <= now;

    if (isExpired && listing.publishStatus === "PUBLISHED") {
      listing.publishStatus = "EXPIRED";
      listing.expiredAt = now;
      listing.autoDeleteAt = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
      await listing.save();
    }

    if (isExpired && !isOwner) {
      return res.status(403).json({ message: "Listing expired" });
    }

    let isFavorited = false;

    if (req.user) {
      const user = await userModel.findById(req.user.id).select(" slug title price city state images category subcategory favorites");
      if (user) {
        isFavorited = user.favorites.some(
          (favId) => favId.toString() === listing._id.toString()
        );
      }
    } 

    res.status(200).json({
      listing,
      isFavorited
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch listing" });
  }
};

export const getListingBySlug = async (req, res) => {
  try {
    const listing = await Listing.findOne({ slug: req.params.slug })
      .populate("owner", "firstName lastName avatar slug");

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const now = new Date();
    const isExpired = listing.expiresAt && listing.expiresAt <= now;

    if (isExpired && listing.publishStatus === "PUBLISHED") {
      listing.publishStatus = "EXPIRED";
      listing.expiredAt = now;
      await listing.save();
    }

    if (listing.publishStatus !== "PUBLISHED") {
      return res.status(403).json({ message: "Listing not published" });
    }

    return res.json({ listing });
  } catch (error) {
    console.error("getListingBySlug error:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch listing",
    });
  }
};