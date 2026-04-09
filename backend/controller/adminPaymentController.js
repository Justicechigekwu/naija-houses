import Payment from "../models/paymentModel.js";
import Listing from "../models/listingModels.js";
import getCategoryPricing from "../utils/getCategoryPricing.js";
import { createNotification } from "../service/notificationService.js";
import {
  emitListingUpdated,
  emitPaymentUpdated,
  emitAdminPaymentsUpdated,
} from "../service/realtimeService.js";
import { emitAdminSnapshot } from "../service/adminRealtimeService.js";
import { removeListingByAdmin } from "../service/listingModerationService.js";

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const cleanText = (value = "") => String(value || "").trim();

const buildListingRoute = (listing) => {
  return listing?.slug ? `/listings/${listing.slug}` : `/listings/${listing._id}`;
};

const buildPaymentRetryRoute = (listing) =>
  `/listing-actions/${listing._id}/rejected-payment`;

export const pendingPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ status: "PENDING_CONFIRMATION" })
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName email")
      .populate("listing", "title publishStatus createdAt category subcategory");

    return res.json(payments);
  } catch (error) {
    console.error("pendingPayments error:", error);
    return res.status(500).json({
      message: error.message || "Failed to load pending payments",
    });
  }
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

    return res.json(payment);
  } catch (error) {
    console.error("getPendingPaymentDetails error:", error);
    return res.status(500).json({
      message: error.message || "Failed to load payment details",
    });
  }
};

export const confirmPaymentAndPublish = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status !== "PENDING_CONFIRMATION") {
      return res.status(400).json({
        message: `Payment already ${payment.status}`,
      });
    }

    const listing = await Listing.findById(payment.listing);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const category = (listing.category || "PROPERTY").toUpperCase();
    const subcategory = (listing.subcategory || "").toUpperCase();
    const pricing = await getCategoryPricing(category, subcategory);

    payment.status = "CONFIRMED";
    await payment.save();

    listing.publishStatus = "PUBLISHED";
    listing.rejectionType = "NONE";
    listing.rejectionReason = "";
    listing.rejectedAt = null;
    listing.publishedAt = new Date();
    listing.expiresAt = addDays(listing.publishedAt, pricing?.paidDays || 30);

    await listing.save();

    emitPaymentUpdated(String(listing.owner), {
      paymentId: payment._id,
      status: payment.status,
      listingId: listing._id,
    });

    emitListingUpdated(String(listing.owner), {
      listingId: listing._id,
      publishStatus: listing.publishStatus,
      publishedAt: listing.publishedAt,
      expiresAt: listing.expiresAt,
      updatedAt: listing.updatedAt,
    });

    emitAdminPaymentsUpdated({
      paymentId: payment._id,
      listingId: listing._id,
      userId: String(listing.owner),
      paymentStatus: payment.status,
      publishStatus: listing.publishStatus,
      type: "PAYMENT_CONFIRMED",
      updatedAt: new Date().toISOString(),
    });

    await emitAdminSnapshot();

    await createNotification({
      userId: listing.owner,
      type: "LISTING_APPROVED",
      title: "Listing approved",
      message: `Your listing "${listing.title}" has been approved and published successfully.`,
      listingId: listing._id,
      metadata: {
        listingId: listing._id,
        publishStatus: listing.publishStatus,
        expiresAt: listing.expiresAt,
        route: buildListingRoute(listing),
        actionLabel: "View listing",
      },
    });

    return res.json({
      message: "Payment confirmed. Listing published.",
      payment,
      listing,
    });
  } catch (error) {
    console.error("confirmPaymentAndPublish error:", error);
    return res.status(500).json({
      message: error.message || "Failed to confirm payment",
    });
  }
};

export const rejectPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const reason =
      cleanText(req.body?.reason) ||
      "Your payment could not be confirmed. Please review and try again.";

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status !== "PENDING_CONFIRMATION") {
      return res.status(400).json({
        message: `Payment already ${payment.status}`,
      });
    }

    const listing = await Listing.findById(payment.listing);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    payment.status = "REJECTED";
    payment.note = reason || payment.note;
    await payment.save();

    listing.publishStatus = "REJECTED";
    listing.rejectionType = "PAYMENT";
    listing.rejectionReason = reason;
    listing.rejectedAt = new Date();

    await listing.save();

    emitPaymentUpdated(String(listing.owner), {
      paymentId: payment._id,
      status: payment.status,
      listingId: listing._id,
    });

    emitListingUpdated(String(listing.owner), {
      listingId: listing._id,
      publishStatus: listing.publishStatus,
      rejectionType: listing.rejectionType,
      updatedAt: listing.updatedAt,
    });

    emitAdminPaymentsUpdated({
      paymentId: payment._id,
      listingId: listing._id,
      userId: String(listing.owner),
      paymentStatus: payment.status,
      publishStatus: listing.publishStatus,
      rejectionType: "PAYMENT",
      type: "PAYMENT_REJECTED",
      updatedAt: new Date().toISOString(),
    });

    await emitAdminSnapshot();

    await createNotification({
      userId: listing.owner,
      type: "PAYMENT_REJECTED",
      title: "Payment rejected",
      message: `Your payment for "${listing.title}" was rejected. Please review and submit payment again.`,
      listingId: listing._id,
      metadata: {
        listingId: listing._id,
        publishStatus: listing.publishStatus,
        rejectionType: "PAYMENT",
        reason,
        route: buildPaymentRetryRoute(listing),
        actionLabel: "Retry payment",
      },
    });

    return res.json({
      message: "Payment rejected successfully.",
      payment,
      listing,
    });
  } catch (error) {
    console.error("rejectPayment error:", error);
    return res.status(500).json({
      message: error.message || "Failed to reject payment",
    });
  }
};

export const rejectPaymentForPolicyViolation = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const reason =
      cleanText(req.body?.reason) ||
      "This listing violates marketplace rules and cannot be approved.";
    const violationPolicy = req.body?.violationPolicy || "PROHIBITED_ITEMS";

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status !== "PENDING_CONFIRMATION") {
      return res.status(400).json({
        message: `Payment already ${payment.status}`,
      });
    }

    const listing = await Listing.findById(payment.listing);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    payment.status = "REJECTED";
    payment.note = reason || payment.note;
    await payment.save();

    emitPaymentUpdated(String(listing.owner), {
      paymentId: payment._id,
      status: payment.status,
      listingId: listing._id,
    });

    const updatedListing = await removeListingByAdmin({
      listing,
      adminId: req.admin.id,
      reason,
      violationPolicy,
      source: "PAYMENT_REVIEW",
      rejectionType: "PROHIBITED",
    });

    emitAdminPaymentsUpdated({
      paymentId: payment._id,
      listingId: listing._id,
      userId: String(listing.owner),
      paymentStatus: payment.status,
      publishStatus: updatedListing.publishStatus,
      rejectionType: "PROHIBITED",
      type: "PAYMENT_REJECTED_POLICY",
      updatedAt: new Date().toISOString(),
    });

    await emitAdminSnapshot();

    return res.json({
      message: "Payment rejected and listing removed for policy violation.",
      payment,
      listing: updatedListing,
    });
  } catch (error) {
    console.error("rejectPaymentForPolicyViolation error:", error);
    return res.status(500).json({
      message: error.message || "Failed to reject listing for policy violation",
    });
  }
};