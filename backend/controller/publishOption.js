import Listing from "../models/listingModels.js";
import Payment from "../models/paymentModel.js";
import userModel from "../models/userModel.js";
import getCategoryPricing from "../utils/getCategoryPricing.js";

export const publishOptions = async (req, res) => {
  const { id } = req.params;
  
  const listing = await Listing.findById(id);
  if (!listing) return res.status(404).json({ message: "Listing not found" });

  if (String(listing.owner) !== String(req.user.id)) {
    return res.status(403).json({ message: "Not your listing" });
  }

  const category = (listing.category || "PROPERTY").toUpperCase();
  const subcategory = (listing.subcategory || "").toUpperCase();
  const trialKey = subcategory ? `${category}_${subcategory}` : category;

  const pricing = await getCategoryPricing(category, subcategory);


  if (!pricing) {
    return res.status(500).json({ message: "Pricing not configured. Contact admin." });
  }

  const user = await userModel.findById(req.user.id).select("trialUsed");
  const alreadyUsed = user?.trialUsed?.get(trialKey) === true;
  const canUseTrial = pricing.trialEnabled && !alreadyUsed;

  const now = new Date();

  const payment = await Payment.findOne({
    listing: listing._id,
    user: req.user.id,
    method: "BANK_TRANSFER",
    status: { $in: ["INITIATED", "PENDING_CONFIRMATION"] },
  }).sort({ createdAt: -1 });

  const isAccountActive =
    payment &&
    payment.status === "INITIATED" &&
    payment.accountExpiresAt &&
    payment.accountExpiresAt > now;

  res.json({
    listingId: listing._id,
    category,
    subcategory,
    canUseTrial,
    trialDays: pricing.trialDays,
    paidDays: pricing.paidDays,
    price: pricing.publishPrice,
    publishStatus: listing.publishStatus,
    publishPlan: listing.publishPlan,
    activePayment: payment
      ? {
          id: payment._id,
          paymentCode: payment.paymentCode,
          status: payment.status,
          amount: payment.amount,
          accountAssignedAt: payment.accountAssignedAt,
          accountExpiresAt: payment.accountExpiresAt,
          isAccountActive,
        }
      : null,
    bankDetails: isAccountActive ? payment.assignedBank : null,
  });
};