import mongoose from "mongoose";

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Velora connected to Database 😎');
    } catch (error) {
        console.log('Error connecting to database', error);
        process.exit(1);
    }
}

export default dbConnect