import "dotenv/config";
import mongoose from "mongoose";
import Listing from "../models/listingModels.js";
import { geocodeAddress } from "../utils/geocodeAddress.js";

const MONGO_URI = process.env.MONGODB_URI;

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");

  const listings = await Listing.find({
    $or: [{ geo: { $exists: false } }, { geo: null }],
  }).select("_id location city state");

  console.log(`Found ${listings.length} listings to geocode`);

  for (const listing of listings) {
    try {
      const geo = await geocodeAddress({
        location: listing.location,
        city: listing.city,
        state: listing.state,
      });

      if (geo) {
        listing.geo = geo;
        await listing.save();
        console.log(`Updated ${listing._id}`);
      } else {
        console.log(`Skipped ${listing._id} - no geo result`);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed ${listing._id}:`, error.message);
    }
  }

  await mongoose.disconnect();
  console.log("Done");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});