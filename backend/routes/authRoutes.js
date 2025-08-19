import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import {signup, login} from '../controller/authController.js';

const router = express.Router()

router.get('/profile', verifyToken, (req, res) => {
    res.json({
        message: 'This is a protected route.',
        user: req.user
    });
});

router.post('/register', signup)
router.post('/login', login)
// router.post('/google', googleAuth)

export default router;