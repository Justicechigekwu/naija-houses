// import Payment from "../models/paymentModel.js";
// import Listing from "../models/listingModels.js";

// const addDays = (date, days) => {
//   const d = new Date(date);
//   d.setDate(d.getDate() + days);
//   return d;
// };

// export const pendingPayments = async (req, res) => {
//   const payments = await Payment.find({ status: "PENDING_CONFIRMATION" })
//     .sort({ createdAt: -1 })
//     .populate("user", "firstName lastName email")
//     .populate("listing", "title publishStatus createdAt");

//   res.json(payments);
// };

// export const confirmPaymentAndPublish = async (req, res) => {
//   try {
//     const { paymentId } = req.params;

//     const payment = await Payment.findById(paymentId);
//     if (!payment) return res.status(404).json({ message: "Payment not found" });
//     if (payment.status !== "PENDING_CONFIRMATION") {
//       return res.status(400).json({ message: `Payment already ${payment.status}` });
//     }

//     const listing = await Listing.findById(payment.listing);
//     if (!listing) return res.status(404).json({ message: "Listing not found" });

//     payment.status = "CONFIRMED";
//     await payment.save();

//     listing.publishStatus = "PUBLISHED";
//     listing.publishedAt = new Date();
//     listing.expiresAt = addDays(listing.publishedAt, 30);
//     await listing.save();

//     res.json({ message: "Payment confirmed. Listing published.", payment, listing });
//   } catch (error) {
//     res.status(500).json({ message: error.message || "Failed to confirm payment" });
//   }
// };

// export const rejectPayment = async (req, res) => {
//   try {
//     const { paymentId } = req.params;

//     const payment = await Payment.findById(paymentId);
//     if (!payment) return res.status(404).json({ message: "Payment not found" });
//     if (payment.status !== "PENDING") return res.status(400).json({ message: "Payment already processed" });

//     const listing = await Listing.findById(payment.listing);

//     payment.status = "REJECTED";
//     await payment.save();

//     if (listing) {
//       listing.publishStatus = "REJECTED";
//       await listing.save();
//     }

//     res.json({ message: "Payment rejected.", paymentId });
//   } catch (error) {
//     res.status(500).json({ message: error.message || "Failed to reject payment" });
//   }
// };



import Payment from "../models/paymentModel.js";
import Listing from "../models/listingModels.js";
import getCategoryPricing from "../utils/getCategoryPricing.js";

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
    }

    res.json({ message: "Payment rejected.", paymentId });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to reject payment" });
  }
};