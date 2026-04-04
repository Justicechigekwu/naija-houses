import Listing from "../models/listingModels.js";

const addMinutes = (date, minutes) =>
  new Date(date.getTime() + minutes * 60 * 1000);

export const createDrafts = async (req, res) => {
  try {
    const existing = await Listing.findOne({
      owner: req.user.id,
      publishStatus: "DRAFT",
    }).sort({ updatedAt: -1 });

    if (existing) {
      existing.draftReminderAt = addMinutes(new Date(), 60);
      existing.draftReminderSentAt = null;
      await existing.save();

      return res.status(200).json({
        message: "Resuming existing draft",
        listing: existing,
        resumed: true,
      });
    }

    const draft = await Listing.create({
      owner: req.user.id,
      publishStatus: "DRAFT",
      category: req.body.category || "PROPERTY",
      images: [],
      draftReminderAt: addMinutes(new Date(), 30),
      draftReminderSentAt: null,
    });

    return res.status(201).json({
      message: "Draft created",
      listing: draft,
      resumed: false,
    });
  } catch (error) {
    console.error("createOrResumeDraft error:", error);
    res.status(500).json({
      message: error.message || "Failed to create/resume draft",
    });
  }
};

export const draftListings = async (req, res) => {
  try {
    const drafts = await Listing.find({
      owner: req.user.id,
      publishStatus: "DRAFT",
    })
      .select(
        "title category subcategory publishPlan updatedAt createdAt images price state location city draftReminderAt draftReminderSentAt"
      )
      .sort({ updatedAt: -1 });

    res.status(200).json(drafts);
  } catch (error) {
    console.error("getMyDraftListings error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch drafts" });
  }
};

export const deleteDraft = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ message: "Draft not found" });

    if (String(listing.owner) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (listing.publishStatus !== "DRAFT") {
      return res
        .status(400)
        .json({ message: "Only drafts can be cleared/deleted" });
    }

    await listing.deleteOne();

    return res.status(200).json({ message: "Draft cleared (deleted)" });
  } catch (error) {
    console.error("deleteDraft error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to delete draft" });
  }
};