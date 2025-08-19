import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import dbConnect from './config/databaseConfig.js';
import cors from 'cors';
import listingRoutes from './routes/listingRoutes.js'
import authRoutes from './routes/authRoutes.js'
import profileRoutes from './routes/profileRoutes.js'


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
app.use('/api', profileRoutes)
app.use('/api/listings', listingRoutes)

app.get('/api/ping', (req, res) => {
    res.json({ message: 'Backend connected'})
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));