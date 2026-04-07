import Listing from "../models/listingModels.js";

export const getRejectedPaymentListing = async (req, res) => {
  try {
    const { listingId } = req.params;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (String(listing.owner) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (listing.publishStatus !== "REJECTED") {
      return res.status(400).json({
        message: "This listing is not currently rejected",
      });
    }

    if (listing.rejectionType !== "PAYMENT") {
      return res.status(400).json({
        message: "This rejected listing is not a payment rejection",
      });
    }

    return res.status(200).json({
      _id: listing._id,
      slug: listing.slug,
      title: listing.title,
      listingType: listing.listingType,
      price: listing.price,
      location: listing.location,
      city: listing.city,
      state: listing.state,
      description: listing.description,
      postedBy: listing.postedBy,
      category: listing.category,
      subcategory: listing.subcategory,
      attributes: listing.attributes || {},
      images: listing.images || [],
      publishStatus: listing.publishStatus,
      publishPlan: listing.publishPlan,
      rejectionType: listing.rejectionType || "NONE",
      rejectionReason: listing.rejectionReason || "",
      rejectedAt: listing.rejectedAt,
      updatedAt: listing.updatedAt,
      createdAt: listing.createdAt,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to load rejected payment listing",
    });
  }
};