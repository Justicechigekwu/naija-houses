import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import dbConnect from './config/databaseConfig.js';
import cors from 'cors';
import listingStatusRoutes from "./routes/listingStatusRoutes.js";
import listingRoutes from './routes/listingRoutes.js'
import authRoutes from './routes/authRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import resetPasswordRoutes from './routes/resetPasswordRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import paymentRoutes from "./routes/paymentRoutes.js";
//admin
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import adminPaymentRoutes from "./routes/adminPaymentRoutes.js";



dotenv.config();
dbConnect();

const app = express()
app.use(express.json());

app.use(cors({ 
    origin:process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));
app.use('/api/auth', authRoutes)
app.use('/api/reset', resetPasswordRoutes)
app.use('/api', profileRoutes)
app.use("/api/listings", listingStatusRoutes);
app.use('/api/listings', listingRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/chats', chatRoutes)
app.use("/api/payments", paymentRoutes);
//admin
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminDashboardRoutes);
app.use("/api/admin", adminPaymentRoutes);


app.get('/api/ping', (req, res) => {
    res.json({ message: 'Backend connected'})
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));