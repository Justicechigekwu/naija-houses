import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import uploadPaymentProof from "../middleware/paymentProofUploadMiddleware.js";
import { paymentMethods, notifyPayment } from "../controller/paymentController.js";

const router = express.Router();

router.get("/methods", paymentMethods);
router.post(
  "/notify",
  verifyToken,
  uploadPaymentProof.array("proofAttachments", 3),
  notifyPayment
);

export default router;