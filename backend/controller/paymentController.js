import Listing from "../models/listingModels.js";
import Payment from "../models/paymentModel.js";
import {
  emitListingUpdated,
  emitPaymentUpdated,
  emitAdminPaymentsUpdated,
} from "../service/realtimeService.js";

export const paymentMethods = async (req, res) => {
  res.json({
    recommended: "BANK_TRANSFER",
    methods: [
      { key: "BANK_TRANSFER", label: "Bank Transfer (Recommended)" },
      { key: "PAYSTACK", label: "Paystack (Coming soon)" },
      { key: "FLUTTERWAVE", label: "Flutterwave (Coming soon)" },
      { key: "CARD", label: "Card (Coming soon)" },
    ],
  });
};

export const notifyPayment = async (req, res) => {
  try {
    const {
      listingId,
      method = "BANK_TRANSFER",
      reference = "",
      note = "",
    } = req.body;

    if (!listingId) {
      return res.status(400).json({ message: "listingId is required" });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (String(listing.owner) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not authorized for this listing" });
    }

    if (listing.publishPlan !== "PAID_30_DAYS") {
      return res.status(400).json({ message: "This listing is not on a paid plan" });
    }

    if (!["DRAFT", "REJECTED", "EXPIRED"].includes(listing.publishStatus)) {
      return res.status(400).json({
        message: `Listing is currently ${listing.publishStatus}`,
      });
    }

    const payment = await Payment.findOne({
      listing: listing._id,
      user: req.user.id,
      method,
      status: { $in: ["INITIATED", ] },
    }).sort({ createdAt: -1 });

    if (!payment) {
      return res.status(400).json({
        message: "No active payment found for this listing.",
      });
    }

    const now = new Date();

    if (payment.status === "INITIATED") {
      if (!payment.accountExpiresAt || payment.accountExpiresAt <= now) {
        payment.status = "EXPIRED";
        await payment.save();

        return res.status(400).json({
          message: "This payment account has expired. Please request a new payment account.",
        });
      }
    }

    const uploadedProofs = Array.isArray(req.files)
      ? req.files.map((file) => ({
          url: file.path,
          public_id: file.filename,
          resource_type:
            file.resource_type ||
            (file.mimetype === "application/pdf" ? "raw" : "image"),
          originalName: file.originalname || "",
          uploadedAt: new Date(),
        }))
      : [];

    payment.status = "PENDING_CONFIRMATION";
    payment.reference = reference || payment.reference;
    payment.note = note || payment.note;

    if (uploadedProofs.length > 0) {
      payment.proofAttachments = uploadedProofs;
    }

    await payment.save();

    listing.publishStatus = "PENDING_CONFIRMATION";
    listing.rejectionType = "NONE";
    listing.rejectionReason = "";
    listing.rejectedAt = null;
    await listing.save();

    emitPaymentUpdated(listing.owner.toString(), {
      paymentId: payment._id,
      status: payment.status,
      listingId: listing._id,
    });

    emitListingUpdated(listing.owner.toString(), {
      listingId: listing._id,
      publishStatus: listing.publishStatus,
      rejectionType: listing.rejectionType,
      rejectionReason: listing.rejectionReason,
      updatedAt: listing.updatedAt,
    });

    res.json({
      message: "Payment marked as sent. Waiting for admin confirmation.",
      paymentId: payment._id,
      paymentCode: payment.paymentCode,
      assignedBank: payment.assignedBank,
      accountExpiresAt: payment.accountExpiresAt,
      listingId: listing._id,
      proofAttachments: payment.proofAttachments || [],
    });

    emitAdminPaymentsUpdated({
      paymentId: payment._id,
      listingId: listing._id,
      userId: req.user.id,
      status: payment.status,
      publishStatus: listing.publishStatus,
      type: "PAYMENT_SUBMITTED",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to submit payment",
    });
  }
};