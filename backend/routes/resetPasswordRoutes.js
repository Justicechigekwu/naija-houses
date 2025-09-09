import express from 'express';
import { forgotPassword, resetPassword } from '../controller/forgotPasswordController.js';

const router = express.Router();

router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

export default router;
