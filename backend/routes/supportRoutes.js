import express from "express";
import { createSupportMessage } from "../controller/supportController.js";
import verifyToken  from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createSupportMessage);

export default router;