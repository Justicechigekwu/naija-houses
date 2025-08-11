import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please enter a title for the listing'],
            trim: true,
        },

        listingType: { 
            type: String, 
            enum: ['Sale', 'Rent'], 
            required: true 
        },

        propertyType: { 
            type: String,
            enum: ['House', 'Apartment', 'Duplex', 'Bungalow'], 
            required: true },

        salePrice: {
            type: Number,
            required: [true, "Please enter a price"],
        },

        rentPrice: { 
            type: Number,
            required: [true, "Please enter a price"]
        },

        location: {
            type: String,
            required: [true, 'Please enter a location'],
        },

        size: { 
            type: Number 
        },

        bedrooms: { 
            type: Number,
            required: true 
        },

        bathrooms: { 
            type: Number, 
            required: true 
        },

        parkingSpaces: { 
            type: Number, 
            default: 0 
        },

        city: { 
            type: String 
        },

        state: { 
            type: String 
        },

        furnished: { 
            type: Boolean, 
            default: false 
        },

        images: [String],

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        status: { 
            type: String, 
            enum: ['Available', 'Sold', 'Rented'], 
            default: 'Available' 
        }
    },
    { timestamps: true }
);

const listing = mongoose.model('listing', listingSchema);
export default listing;