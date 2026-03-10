import Listing from "../models/listingModels.js";
import Payment from "../models/paymentModel.js";
import getCategoryPricing from "../utils/getCategoryPricing.js";
import generatePaymentCode from "../utils/generatePaymentCodeUtils.js";
import assignBankAccount from "../utils/assignBankAccount.js";
import userModel from "../models/userModel.js";

const addDays = (date, days) =>
  new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

const addMinutes = (date, minutes) =>
  new Date(date.getTime() + minutes * 60 * 1000);

export const choosePublishPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { plan } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (String(listing.owner) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not your listing" });
    }

    if (["PUBLISHED", "PENDING_CONFIRMATION"].includes(listing.publishStatus)) {
      return res.status(400).json({ message: `Listing is already ${listing.publishStatus}` });
    }

    const category = (listing.category || "PROPERTY").toUpperCase();
    const subcategory = (listing.subcategory || "").toUpperCase();
    const trialKey = subcategory ? `${category}_${subcategory}` : category;

    const pricing = await getCategoryPricing(category, subcategory);
    if (!pricing) {
      return res.status(500).json({ message: "Pricing not configured. Contact admin." });
    }

    if (plan === "TRIAL_14_DAYS") {
      const user = await userModel.findById(req.user.id).select("trialUsed");
      const alreadyUsed = user?.trialUsed?.get(trialKey) === true;

      if (!pricing.trialEnabled) {
        return res.status(400).json({ message: "Trial disabled for this subcategory" });
      }

      if (alreadyUsed) {
        return res.status(400).json({ message: "Trial already used for this subcategory" });
      }

      const now = new Date();
      listing.publishPlan = "TRIAL_14_DAYS";
      listing.publishStatus = "PUBLISHED";
      listing.publishedAt = now;
      listing.expiresAt = addDays(now, pricing.trialDays);
      await listing.save();

      if (!user.trialUsed) user.trialUsed = new Map();
      user.trialUsed.set(trialKey, true);
      await user.save();

      return res.json({ message: `Published on ${pricing.trialDays}-day trial`, listing });
    }

    if (plan === "PAID_30_DAYS") {
      listing.publishPlan = "PAID_30_DAYS";
      listing.publishStatus = "DRAFT";
      listing.publishedAt = null;
      listing.expiresAt = null;
      await listing.save();

      const now = new Date();

      let payment = await Payment.findOne({
        listing: listing._id,
        user: req.user.id,
        method: "BANK_TRANSFER",
        status: { $in: ["INITIATED", "REJECTED", "EXPIRED"] },
      }).sort({ createdAt: -1 });

      const existingStillValid =
        payment &&
        payment.status === "INITIATED" &&
        payment.accountExpiresAt &&
        payment.accountExpiresAt > now;

      if (!existingStillValid) {
        const assignedBank = await assignBankAccount();

        let code = generatePaymentCode();
        while (await Payment.exists({ paymentCode: code })) {
          code = generatePaymentCode();
        }

        if (
          payment &&
          payment.status === "INITIATED" &&
          payment.accountExpiresAt &&
          payment.accountExpiresAt <= now
        ) {
          payment.status = "EXPIRED";
          await payment.save();
        }

        payment = await Payment.create({
          listing: listing._id,
          user: req.user.id,
          amount: pricing.publishPrice,
          method: "BANK_TRANSFER",
          paymentCode: code,
          status: "INITIATED",
          assignedBank,
          accountAssignedAt: now,
          accountExpiresAt: addMinutes(now, 30),
        });
      }

      return res.json({
        message: "Payment required",
        listing,
        pricing: {
          price: pricing.publishPrice,
          paidDays: pricing.paidDays,
        },
        payment: {
          id: payment._id,
          paymentCode: payment.paymentCode,
          status: payment.status,
          amount: payment.amount,
          accountAssignedAt: payment.accountAssignedAt,
          accountExpiresAt: payment.accountExpiresAt,
        },
        bankDetails: payment.assignedBank,
      });
    }

    return res.status(400).json({ message: "Invalid plan" });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message || "Failed to choose plan",
      missingFields: err.missingFields || undefined,
    });
  }
};