import cron from "node-cron";
import Listing from "../models/listingModels.js";
import userModel from "../models/userModel.js";
import Payment from "../models/paymentModel.js";
import cloudinary from "../config/cloudinaryConfig.js";
import markExpiredListings from "../utils/markExpiredListings.js";

const startExpireListingsJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      await markExpiredListings();

      const listingsToDelete = await Listing.find({
        publishStatus: "EXPIRED",
        autoDeleteAt: { $ne: null, $lte: new Date() },
      });

      for (const listing of listingsToDelete) {
        if (listing.images?.length) {
          await Promise.allSettled(
            listing.images.map((img) =>
              cloudinary.uploader.destroy(img.public_id)
            )
          );
        }

        await userModel.updateMany(
          { favorites: listing._id },
          { $pull: { favorites: listing._id } }
        );

        await Payment.deleteMany({ listing: listing._id });

        await listing.deleteOne();
      }
    } catch (error) {
      console.error("Expire listings job failed:", error.message);
    }
  });
};

export default startExpireListingsJob;