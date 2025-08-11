'use client'

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ContactSeller({ listingId }: { listingId: string}) {
    const { user } = useAuth();
    const router = useRouter();

    const handleClick = () => {
        if (!user) {
            alert('Please log in to contact the seller.');
            router.push('/auth/login');
            return;
        }

        router.push(`/listings/${listingId}/contact`);
    };

    return (
        <button
        onClick={handleClick}
        className="bg-green-600 text-white px-4 py-2 rounded"
        >
            Contact Seller
        </button>
    );
}