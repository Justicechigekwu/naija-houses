import cron from "node-cron";
import Listing from "../models/listingModels.js";
import Notification from "../models/notificationModel.js";
import { createNotification } from "../service/notificationService.js";

const startDraftReminderJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      // console.log("draft reminder job running...");

      const now = new Date();

      const dueDrafts = await Listing.find({
        publishStatus: "DRAFT",
        draftReminderAt: { $ne: null, $lte: now },
        draftReminderSentAt: null,
      }).select(
        "_id owner title publishStatus draftReminderAt draftReminderSentAt"
      );

      // console.log("dueDrafts:", dueDrafts.length);

      for (const draft of dueDrafts) {
        const existingNotification = await Notification.findOne({
          user: draft.owner,
          type: "DRAFT_REMINDER",
          listing: draft._id,
          "metadata.reminderForTime": draft.draftReminderAt,
        });

        if (!existingNotification) {
          await createNotification({
            userId: draft.owner,
            type: "DRAFT_REMINDER",
            title: "You have an unpublished advert",
            message: "You left an advert unpublished. Tap to continue and publish it.",
            listingId: draft._id,
            metadata: {
              route: "/drafts",
              action: "OPEN_DRAFTS_PAGE",
              reminderForTime: draft.draftReminderAt,
              publishStatus: draft.publishStatus,
            },
          });
        }

        draft.draftReminderSentAt = now;
        await draft.save();
      }
    } catch (error) {
      console.error("draft reminder job error:", error);
    }
  });
};

export default startDraftReminderJob;