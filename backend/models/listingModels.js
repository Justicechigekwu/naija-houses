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
            enum: ['House', 'Apartment', 'Duplex', 'Bungalow', 'Mansion']
        },

        price: {
            type: String,
            required: [true, 'Please enter a price']
        },

        location: {
            type: String,
            required: [true, 'Please enter a location'],
        },

        state: { 
            type: String,
            required: [true, 'Please enter a state']
        },

        size: { 
            type: Number 
        },

        bedrooms: { 
            type: Number,
        },

        bathrooms: { 
            type: Number, 
        },

        parkingSpaces: { 
            type: Number, 
            default: 0 
        },

        city: { 
            type: String 
        },


        furnished: { 
            type: String,
            enum: ['Yes', 'No'],
        },

        images: [String],

        postedBy: {
            type: String,
            enum: ['Owner', 'Agent'],
            required: true
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ['Available', 'Sold', 'Rented'],
            default: 'Available'
        },
    },
    { timestamps: true }
);

const Listing = mongoose.model('listing', listingSchema);
export default Listing;