import Payment from "../models/paymentModel.js";
import Listing from "../models/listingModels.js";
import getCategoryPricing from "../utils/getCategoryPricing.js";
import { createNotification } from "../service/notificationService.js";
import { emitListingUpdated, emitPaymentUpdated } from "../service/realtimeService.js";

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export const pendingPayments = async (req, res) => {
  const payments = await Payment.find({ status: "PENDING_CONFIRMATION" })
    .sort({ createdAt: -1 })
    .populate("user", "firstName lastName email")
    .populate("listing", "title publishStatus createdAt category subcategory");

  res.json(payments);
};

export const getPendingPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId)
      .populate("user", "firstName lastName email avatar")
      .populate({
        path: "listing",
        populate: {
          path: "owner",
          select: "firstName lastName email avatar",
        },
      });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to load payment details",
    });
  }
};

export const confirmPaymentAndPublish = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    if (payment.status !== "PENDING_CONFIRMATION") {
      return res.status(400).json({ message: `Payment already ${payment.status}` });
    }

    const listing = await Listing.findById(payment.listing);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    const category = (listing.category || "PROPERTY").toUpperCase();
    const subcategory = (listing.subcategory || "").toUpperCase();
    const pricing = await getCategoryPricing(category, subcategory);

    payment.status = "CONFIRMED";
    await payment.save();

    listing.publishStatus = "PUBLISHED";
    listing.publishedAt = new Date();
    listing.expiresAt = addDays(listing.publishedAt, pricing?.paidDays || 30);
    await listing.save();

    emitPaymentUpdated(listing.owner.toString(), {
      paymentId: payment._id,
      status: payment.status,
      listingId: listing._id,
    });

    emitListingUpdated(listing.owner.toString(), {
      listingId: listing._id,
      publishStatus: listing.publishStatus,
      publishedAt: listing.publishedAt,
      expiresAt: listing.expiresAt,
    });

    await createNotification({
      userId: listing.owner,
      type: "LISTING_APPROVED",
      title: "Listing approved",
      message: `Your listing "${listing.title}" has been approved and published successfully.`,
      listingId: listing._id,
      metadata: {
        route: `/listings/${listing.slug}`,
        publishStatus: listing.publishStatus,
        expiresAt: listing.expiresAt,
      },
    });

    res.json({ message: "Payment confirmed. Listing published.", payment, listing });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to confirm payment" });
  }
};

export const rejectPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    if (payment.status !== "PENDING_CONFIRMATION") {
      return res.status(400).json({ message: `Payment already ${payment.status}` });
    }

    const listing = await Listing.findById(payment.listing);

    payment.status = "REJECTED";
    await payment.save();

    if (listing) {
      listing.publishStatus = "DRAFT";
      await listing.save();

      await createNotification({
        userId: listing.owner,
        type: "PAYMENT_REJECTED",
        title: "Payment rejected",
        message: `Your payment for listing "${listing.title}" was rejected. Please review and submit again.`,
        listingId: listing._id,
      });
    }

    res.json({ message: "Payment rejected.", paymentId });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to reject payment" });
  }
};