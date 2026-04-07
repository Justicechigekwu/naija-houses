// middleware/paymentProofUploadMiddleware.js

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinaryConfig.js";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPdf = file.mimetype === "application/pdf";

    return {
      folder: "velora/payment-proofs",
      resource_type: isPdf ? "raw" : "image",
      public_id: `payment-proof-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    };
  },
});

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new Error("Only JPG, JPEG, PNG, WEBP images or PDF files are allowed.")
    );
  }

  cb(null, true);
};

const uploadPaymentProof = multer({
  storage,
  fileFilter,
  limits: {
    files: 3,
    fileSize: 8 * 1024 * 1024,
  },
});

export default uploadPaymentProof;