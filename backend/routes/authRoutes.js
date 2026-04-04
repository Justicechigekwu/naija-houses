import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import {
  signup,
  login,
  logout,
  getMe,
} from "../controller/authController.js";
import { googleAuth } from "../controller/googleAuthController.js";

const router = express.Router();

router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "This is a protected route.",
    user: req.user,
  });
});

router.post("/register", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/me", verifyToken, getMe);
router.post("/logout", logout);

export default router;