import express from "express";
import {
  adminRegister,
  adminLogin,
  getAdminMe,
  adminLogout,
} from "../controller/adminAuthController.js";
import verifyAdmin from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.post("/logout", adminLogout)
router.get("/me", verifyAdmin, getAdminMe);

export default router;