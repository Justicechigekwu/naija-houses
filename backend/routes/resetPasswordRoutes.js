import express from 'express';
import { forgotPassword, resetPassword, forgotPasswordLimiter } from '../controller/forgotPasswordController.js';

const router = express.Router();

router.post('/forgot-password',forgotPasswordLimiter, forgotPassword);
router.put('/reset-password/:token', resetPassword);

export default router;
