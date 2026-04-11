import cron from "node-cron";
import Listing from "../models/listingModels.js";
import userModel from "../models/userModel.js";
import Payment from "../models/paymentModel.js";

const startDeleteExpiredRemovedListingsJob = () => {
  cron.schedule("0 2 * * *", async () => {
    try {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);

      const listings = await Listing.find({
        publishStatus: "REMOVED_BY_ADMIN",
        adminRemovedAt: { $lte: cutoff },
        appealStatus: "NONE",
      });


      for (const listing of listings) {
        await userModel.updateMany(
          { favorites: listing._id },
          { $pull: { favorites: listing._id } }
        );

        await Payment.deleteMany({ listing: listing._id });
        await listing.deleteOne();
      }

      if (listings.length) {
        console.log(`Deleted ${listings.length} unappealed removed listings`);
      }
    } catch (error) {
      console.error("Delete removed listings job failed:", error.message);
    }
  });
};

export default startDeleteExpiredRemovedListingsJob;
