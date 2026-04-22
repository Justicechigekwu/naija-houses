"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import useRejectedPaymentListing from "@/hooks/useRejectedPaymentListing";
import PageReadyLoader from "@/components/pages/PageReadyLoader";

export default function RejectedPaymentPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const listingId = params?.id as string;

  const { listing, loading, error } = useRejectedPaymentListing(listingId);

  if (!loading && !listing) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="rounded-xl border bg-white p-6">
          <h1 className="text-xl font-semibold">Rejected Payment</h1>
          <p className="text-sm text-red-600 mt-2">
            {error || "Listing not found."}
          </p>

          <button
            onClick={() => router.push("/notification")}
            className="mt-4 border px-4 py-2 rounded"
          >
            Back to notifications
          </button>
        </div>
      </div>
    );
  }

  const image = listing?.images?.[0]?.url;

  return (
    <PageReadyLoader ready={!loading}>
      <div className="max-w-5xl mx-auto p-4 space-y-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <h1 className="text-2xl font-semibold text-red-800">
            Payment Rejected
          </h1>
          <p className="mt-2 text-sm text-red-700">
            Your payment for this listing was rejected. Review the reason below,
            then continue to payment details to retry payment.
          </p>
        </div>

        {listing?.rejectionReason && (
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
            <h2 className="text-base font-semibold text-yellow-900">
              Rejection reason
            </h2>
            <p className="mt-2 text-sm text-yellow-800">
              {listing.rejectionReason}
            </p>
          </div>
        )}

        {listing && (
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="grid md:grid-cols-[260px_1fr] gap-6">
              <div className="w-full h-56 bg-gray-100 rounded-xl overflow-hidden">
                {image ? (
                  <img
                    src={image}
                    alt={listing.title || "Listing image"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                    No image
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <h2 className="text-xl font-semibold">
                    {listing.title || "Untitled listing"}
                  </h2>
                  <p className="text-green-700 font-semibold mt-1">
                    ₦{Number(listing.price || 0).toLocaleString()}
                  </p>
                </div>

                <p className="text-sm text-gray-600">
                  {[listing.city, listing.state].filter(Boolean).join(", ") ||
                    "No location"}
                </p>

                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-gray-500">Category</p>
                    <p className="font-medium">{listing.category || "-"}</p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-gray-500">Subcategory</p>
                    <p className="font-medium">{listing.subcategory || "-"}</p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-gray-500">Status</p>
                    <p className="font-medium">{listing.publishStatus || "-"}</p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-gray-500">Rejected At</p>
                    <p className="font-medium">
                      {listing.rejectedAt
                        ? new Date(listing.rejectedAt).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                </div>

                {listing.description && (
                  <div className="pt-2">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Description
                    </p>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {listing.description}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-4">
                  <Link
                    href={`/listing-actions/${listing._id}/payment-details`}
                    className="rounded-xl bg-[#8A715D] px-4 py-3 text-sm font-semibold text-white"
                  >
                    Go to payment details
                  </Link>

                  <button
                    onClick={() => router.push("/notification")}
                    className="rounded-xl border px-4 py-3 text-sm font-medium"
                  >
                    Back to notifications
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageReadyLoader>
  );
}