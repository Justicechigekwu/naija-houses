"use client";

import { useParams } from "next/navigation";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewsList from "@/components/reviews/ReviewList";

export default function ReviewsPage() {
  const params = useParams();
  const listingId = params.id as string;

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <ReviewForm listingId={listingId} />
      <ReviewsList listingId={listingId} />
    </div>
  );
}