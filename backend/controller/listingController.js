import Listing from "../models/listingModels.js";

export const createListing = async (req, res) => {
  try {

    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const newListing = new Listing({
      title: req.body.title,
      listingType: req.body.listingType,
      propertyType: req.body.propertyType,
      price: req.body.price,
      location: req.body.location,
      state: req.body.state,
      city: req.body.city,
      size: req.body.size,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      parkingSpaces: req.body.parkingSpaces,
      furnished: req.body.furnished,
      postedBy: req.body.postedBy,
      owner: req.user.id,
      images: imagePaths,
    });

    await newListing.save();
    res.status(201).json(newListing)
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

    let updatedImages = listing.images;
    if (req.files && req.files.length > 0) {
      updatedImages = [...listing.images, ...req.files.map(file => file.filename)];
    }

    const updates = {
      title: req.body.title || listing.title,
      listingType: req.body.listingType || listing.listingType,
      propertyType: req.body.propertyType || listing.propertyType,
      price: req.body.price || listing.price,
      location: req.body.location || listing.location,
      state: req.body.state || listing.state,
      city: req.body.city || listing.city,
      size: req.body.size || listing.size,
      bedrooms: req.body.bedrooms || listing.bedrooms,
      bathrooms: req.body.bathrooms || listing.bathrooms,
      parkingSpaces: req.body.parkingSpaces || listing.parkingSpaces,
      furnished: req.body.furnished || listing.furnished,
      postedBy: req.body.postedBy || listing.postedBy,
      status: req.body.status || listing.status,
      images: updatedImages,
    };


    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id, 
      { $set: updates },
      { new: true }
    );

    res.json({ updatedListing });
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
        const listings = await Listing.find().sort({ createdAt: -1});
        res.status(200).json(listings) 
    } catch (error) {
        res.status(500).json({ message: error.message || 'Failed to fetch listings' });
    }
};

export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if(!listing) {
      return res.status(404).json({ message: 'Listing not found'});
    }
    res.status(200).json(listing)
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch listing'})
  }
}
