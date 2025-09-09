import Listing from "../models/listingModels.js";

const relatedListingController = async (req, res) => {
    try {
        const { id } = req.params;

        const listing = await Listing.findById(id);
        if (!listing) return res.status(404).json({ message: 'Listing not found' });

        const related = await Listing.find({
            _id: { $ne: id },
            propertyType: listing.propertyType,
        }).limit(20);

        res.json(related)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch listings'});
    }
};

export default relatedListingController;