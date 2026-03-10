import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        listing: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Listing',
            required: true
        },
        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userModel',
            required: true
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        comment: {
            type: String,
            default: ""
        }
    },  
    { timestamps: true }
    
)

const Review = 
mongoose.models.Review || mongoose.model ('Review', reviewSchema);
export default Review;