'use client'

import { useState, useEffect } from "react";
import api from "@/libs/api";

type Listing = {
    _id: string;
    title: string;
    price?: string;
    description?: string;
    location?: string;
    images?: string[];
};

type Props = {
    userId: string;
};

export default function UserListings({ userId }: Props) {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const res = await api.get(`/listings/profile/${userId}`);
                setListings(res.data);
            } catch (error) {
                console.error('Failed to fetch users listings', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchListings();
        }
    }, [userId]);

    if (loading) return <p>Loading effect soon...</p>;
    if (listings.length === 0)
        return <p className="text-black-300">You have not created any Listings yet!</p>;

    return (
        <div className="mt-8">
            <h2 className="text-lg font-semibold flex align-items-center">My Listings</h2>
            <ul className="space-y-3">
                {listings.map((listing) => (
                    <li
                    key={listing._id}
                    className="p-4 border rounded shadow-sm bg-gray-50 cursor-pointer hover:shadow-mb transition"
                    >
                        <h3 className="font-bold">{listing.title}</h3>
                        {listing.description && <p className="text-sm text-gray-500">{listing.description}</p>}
                        {listing.price && <p className="text-sm text-gray-500 mt-1">₦{listing.price}</p>}
                    </li>
                ))}
            </ul>
        </div>
    )
}