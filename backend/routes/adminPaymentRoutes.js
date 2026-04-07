// import express from "express";
// import verifyAdmin from "../middleware/adminAuthMiddleware.js";
// import {
//   pendingPayments,
//   getPendingPaymentDetails,
//   confirmPaymentAndPublish,
//   rejectPayment,
// } from "../controller/adminPaymentController.js";

// const router = express.Router();

// router.get("/payments/pending", verifyAdmin, pendingPayments);
// router.get("/payments/:paymentId", verifyAdmin, getPendingPaymentDetails);
// router.post("/payments/:paymentId/confirm", verifyAdmin, confirmPaymentAndPublish);
// router.post("/payments/:paymentId/reject", verifyAdmin, rejectPayment);

// export default router;




import express from "express";
import verifyAdmin from "../middleware/adminAuthMiddleware.js";
import {
  pendingPayments,
  getPendingPaymentDetails,
  confirmPaymentAndPublish,
  rejectPayment,
  rejectPaymentForPolicyViolation,
} from "../controller/adminPaymentController.js";

const router = express.Router();

router.get("/pending", verifyAdmin, pendingPayments);
router.get("/:paymentId", verifyAdmin, getPendingPaymentDetails);
router.post("/:paymentId/confirm", verifyAdmin, confirmPaymentAndPublish);
router.post("/:paymentId/reject", verifyAdmin, rejectPayment);
router.post(
  "/:paymentId/reject-policy",
  verifyAdmin,
  rejectPaymentForPolicyViolation
);

export default router;