import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "userModel", required: true },

    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: ["BANK_TRANSFER", "PAYSTACK", "FLUTTERWAVE", "CARD"],
      default: "BANK_TRANSFER",
    },

    paymentCode: { type: String, required: true, unique: true, index: true },

    status: {
      type: String,
      enum: ["INITIATED", "PENDING_CONFIRMATION", "CONFIRMED", "REJECTED", "EXPIRED"],
      default: "INITIATED",
    },

    reference: { type: String, default: "" },
    note: { type: String, default: "" },

    assignedBank: {
      bankName: { type: String, default: "" },
      accountName: { type: String, default: "" },
      accountNumber: { type: String, default: "" },
    },

    accountAssignedAt: { type: Date, default: null },
    accountExpiresAt: { type: Date, default: null },
  },
  
  { timestamps: true }
);

const Payment =
 mongoose.models.Payment || mongoose.model ('Payment', paymentSchema);
export default Payment;