import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import { paymentMethods, notifyPayment } from "../controller/paymentController.js";

const router = express.Router();

router.get("/methods", paymentMethods);
router.post("/notify", verifyToken, notifyPayment);

export default router;