import cron from "node-cron";
import markExpiredListings from "../utils/markExpiredListings.js";

const startExpireListingsJob = () => {
  // console.log("expired listing running...");
  cron.schedule("* * * * *", async () => {
    try {
      await markExpiredListings();
    } catch (error) {
      console.error("Expire listings job failed:", error.message);
    }
  });
};

export default startExpireListingsJob;