import Listing from "../models/listingModels.js";
import Payment from "../models/paymentModel.js";
import userModel from "../models/userModel.js";
import getCategoryPricing from "../utils/getCategoryPricing.js";
import assignBankAccount from "../utils/assignBankAccount.js";
import generatePaymentCode from "../utils/generatePaymentCodeUtils.js";

const addMinutes = (date, minutes) => {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + minutes);
  return d;
};

export const publishOptions = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (String(listing.owner) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not your listing" });
    }

    const category = (listing.category || "PROPERTY").toUpperCase();
    const subcategory = (listing.subcategory || "").toUpperCase();
    const trialKey = subcategory ? `${category}_${subcategory}` : category;

    const pricing = await getCategoryPricing(category, subcategory);

    if (!pricing) {
      return res.status(500).json({
        message: "Pricing not configured. Contact admin.",
      });
    }

    const user = await userModel.findById(req.user.id).select("trialUsed");
    const alreadyUsed = user?.trialUsed?.get(trialKey) === true;
    const canUseTrial = pricing.trialEnabled && !alreadyUsed;

    const now = new Date();

    let payment = await Payment.findOne({
      listing: listing._id,
      user: req.user.id,
      method: "BANK_TRANSFER",
      status: "INITIATED",
    }).sort({ createdAt: -1 });

    if (payment && (!payment.accountExpiresAt || payment.accountExpiresAt <= now)) {
      payment.status = "EXPIRED";
      await payment.save();
      payment = null;
    }

    if (!payment && listing.publishPlan === "PAID_30_DAYS") {
      const assignedBank = await assignBankAccount();
      const paymentCode = await generatePaymentCode();

      payment = await Payment.create({
        listing: listing._id,
        user: req.user.id,
        amount: pricing.publishPrice,
        method: "BANK_TRANSFER",
        paymentCode,
        status: "INITIATED",
        assignedBank,
        accountAssignedAt: now,
        accountExpiresAt: addMinutes(now, 30),
        reference: "",
        note: "",
        proofAttachments: [],
      });
    }

    const isAccountActive = Boolean(
      payment?.status === "INITIATED" &&
        payment?.accountExpiresAt &&
        payment.accountExpiresAt > now
    );

    return res.json({
      listingId: listing._id,
      slug: listing.slug,
      category,
      subcategory,
      canUseTrial,
      trialDays: pricing.trialDays,
      paidDays: pricing.paidDays,
      price: pricing.publishPrice,
      publishStatus: listing.publishStatus,
      publishPlan: listing.publishPlan,
      rejectionType: listing.rejectionType || "NONE",
      rejectionReason: listing.rejectionReason || "",
      activePayment: payment
        ? {
            id: payment._id,
            paymentCode: payment.paymentCode,
            status: payment.status,
            amount: payment.amount,
            accountAssignedAt: payment.accountAssignedAt,
            accountExpiresAt: payment.accountExpiresAt,
            isAccountActive,
            proofAttachments: payment.proofAttachments || [],
          }
        : null,
      bankDetails: isAccountActive ? payment.assignedBank : null,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to load publish options",
    });
  }
};