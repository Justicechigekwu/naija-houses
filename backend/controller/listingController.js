import Listing from "../models/listingModels.js";

export const createListing = async (req, res) => {
  try {

    console.log("REQ BODY:", req.body);
    console.log("REQ FILES:", req.files);

    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const newListing = new Listing({
      title: req.body.title,
      listingType: req.body.listingType,
      price: req.body.price,
      location: req.body.location,
      state: req.body.state,
      city: req.body.city || "",
      description: req.body.description,
      postedBy: req.body.postedBy,
      owner: req.user.id,
      images: imagePaths,

      publishStatus:  'DRAFT',
      publishPlan: null,
      publishedAt: null,
      expiresAt: null,

      category: req.body.category,
      subcategory: req.body.subcategory,
      attributes: req.body.attributes ? JSON.parse(req.body.attributes) : {},
    });

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
      return res.status(403).json({ message: "Not authorized to update this listing" });
    }

    delete req.body.publishStatus;
    delete req.body.publishPlan;
    delete req.body.publishedAt;
    delete req.body.expiresAt;
    delete req.body.owner;

    let keepImages = req.body.keepImages;
    if (!Array.isArray(keepImages)) {
      keepImages = keepImages ? [keepImages] : [];
    }

    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const updatedImages = [...keepImages, ...newImages];

    const updates = {
      title: req.body.title || listing.title,
      listingType: req.body.listingType || listing.listingType,
      price: req.body.price || listing.price,
      location: req.body.location || listing.location,
      description: req.body.description || listing.description,
      state: req.body.state || listing.state,
      city: req.body.city ?? listing.city,
      postedBy: req.body.postedBy || listing.postedBy,
      images: updatedImages,
      attributes: req.body.attributes
        ? JSON.parse(req.body.attributes)
        : listing.attributes
    };

    if (listing.publishStatus === "DRAFT") {
      updates.category = req.body.category || listing.category;
      updates.subcategory = req.body.subcategory || listing.subcategory;
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id, 
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      ...updatedListing.toObject(),
    images: updatedListing.images.map(
      (img) => `${req.protocol}://${req.get('host')}/uploads/${img}`)
    });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message || "Failed to update" });
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

    await listing.deleteOne();
    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete listing" });
  }
};

export const getLitsing = async (req, res) => {
  try {
    const { search, state, location, category, subcategory, listingType } = req.query;

    const filter = {};
    const now = new Date();

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
          { location: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      });
    }

    if (and.length) filter.$and = and;

    if (state) filter.state = { $regex: state, $options: "i" };
    if (location) filter.location = { $regex: location, $options: "i" };
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (listingType) filter.listingType = listingType;

    const listings = await Listing.find(filter).sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Failed to fetch listings" });
  }
};


export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("owner", "firstName lastName avatar");

    if (!listing) return res.status(404).json({ message: "Listing not found" });

    const isOwner = req.user && String(listing.owner?._id || listing.owner) === String(req.user.id);

    if (listing.publishStatus !== "PUBLISHED" && !isOwner) {
      return res.status(403).json({ message: "Listing not published" });
    }

    const now = new Date();
    const isExpired = listing.expiresAt && listing.expiresAt <= now;
    if (isExpired && !isOwner) {
      return res.status(403).json({ message: "Listing expired" });
    }

    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch listing" });
  }
};
