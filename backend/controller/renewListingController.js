import Listing from "../models/listingModels.js";
import Payment from "../models/paymentModel.js";
import getCategoryPricing from "../utils/getCategoryPricing.js";
import generatePaymentCode from "../utils/generatePaymentCodeUtils.js";
import assignBankAccount from "../utils/assignBankAccount.js";

const addMinutes = (date, minutes) =>
  new Date(date.getTime() + minutes * 60 * 1000);

export const renewExpiredListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (String(listing.owner) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not your listing" });
    }

    if (listing.publishStatus !== "EXPIRED") {
      return res.status(400).json({ message: "Only expired listings can be renewed" });
    }

    const category = (listing.category || "PROPERTY").toUpperCase();
    const subcategory = (listing.subcategory || "").toUpperCase();

    const pricing = await getCategoryPricing(category, subcategory);
    if (!pricing) {
      return res.status(500).json({ message: "Pricing not configured. Contact admin." });
    }

    listing.publishPlan = "PAID_30_DAYS";
    await listing.save();

    const now = new Date();

    let payment = await Payment.findOne({
      listing: listing._id,
      user: req.user.id,
      method: "BANK_TRANSFER",
      status: "INITIATED",
    }).sort({ createdAt: -1 });

    const existingStillValid =
      payment &&
      payment.accountExpiresAt &&
      payment.accountExpiresAt > now;

    if (!existingStillValid) {
      if (payment && payment.accountExpiresAt && payment.accountExpiresAt <= now) {
        payment.status = "EXPIRED";
        await payment.save();
      }

      const assignedBank = await assignBankAccount();

      let code = generatePaymentCode();
      while (await Payment.exists({ paymentCode: code })) {
        code = generatePaymentCode();
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
      message: "Renewal payment created",
      listingId: listing._id,
      payment: {
        id: payment._id,
        paymentCode: payment.paymentCode,
        status: payment.status,
        amount: payment.amount,
        accountAssignedAt: payment.accountAssignedAt,
        accountExpiresAt: payment.accountExpiresAt,
      },
      bankDetails: payment.assignedBank,
      price: pricing.publishPrice,
      paidDays: pricing.paidDays,
    });
  } catch (error) {
    console.error("renewExpiredListing error:", error);
    res.status(500).json({ message: error.message || "Failed to renew listing" });
  }
};
