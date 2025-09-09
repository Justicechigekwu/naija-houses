'use client'

import { useRouter } from "next/navigation";
import api from '@/libs/api';
import { AxiosError} from 'axios'

export default function DeleteListing({ listingId }: { listingId: string}) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete listing?")) return;
        try {
            await api.delete(`/listings/${listingId}`);
            alert('listing deleted successfully');
            router.push('/listings');
        } catch (err: unknown) {
            if (err instanceof AxiosError) 
            alert(err?.response?.data?.message || 'Failed to delete listing')
        }
    };

    return (
        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
            Delete Listing
        </button>
    );
};
