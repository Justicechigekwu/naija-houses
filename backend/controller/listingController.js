import Listing from "../models/listingModels.js";

export const createListing = async (req, res) => {
  try {

    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    const {
      title,
      listingType,
      propertyType,
      salePrice,
      rentPrice,
      location,
      size,
      bedrooms,
      bathrooms,
      parkingSpaces,
      city,
      state,
      furnished,
      status
    } = req.body;

    if (listingType === "Sale" && !salePrice) {
      return res.status(400).json({ message: "Sale price is required for properties for sale." });
    }

    if (listingType === "Rent" && !rentPrice) {
      return res.status(400).json({ message: "Rental price is required for properties for rent." });
    }

    const newListing = await Listing.create({
      title,
      listingType,
      propertyType,
      salePrice,
      rentPrice,
      location,
      size,
      bedrooms,
      bathrooms,
      parkingSpaces,
      city,
      state,
      furnished,
      images: imagePaths,
      owner: req.user.id,
      status
    });

    res.status(200).json({
      message: "Listing created successfully",
      listing: newListing
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to create listing" });
  }
};

export const updateListing = async (req, res) => {
  try {
    const listingItem = await Listing.findById(req.params.id);

    if (!listingItem) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listingItem.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this listing" });
    }

    let updatedImages = listingItem.images;
    if (req.file && req.files.length > 0) {
      const newImages = req.file.map(file => `/uploads/${file.filename}`);
      updatedImages = [...updatedImages, ...newImages];
    }

    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ message: "Listing updated", listing: updatedListing });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update" });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const listingItem = await Listing.findById(req.params.id);

    if (!listingItem) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listingItem.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this listing" });
    }

    await listingItem.deleteOne();
    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete listing" });
  }
};

export const getLitsing = async (req, res) => {
    try {
        const listings = await Listing.find().sort({ createdAt: -1});
        res.status(200).json(listings) 
    } catch (error) {
        res.status(500).json({ message: error.message || 'Failed to fetch listings' });
    }
};
