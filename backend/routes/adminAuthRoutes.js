import express from "express";
import { adminRegister, adminLogin } from "../controller/adminAuthController.js";

const router = express.Router();

router.post("/register", adminRegister);
router.post("/login", adminLogin);

export default router;

