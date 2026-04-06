"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/libs/api";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewsList from "@/components/reviews/ReviewList";
import { ArrowLeft, MessageSquareText, Star, ShieldCheck } from "lucide-react";

type ListingOwnerResponse = {
  listing?: {
    _id: string;
    title?: string;
    owner?: {
      _id: string;
    };
  };
};

export default function ReviewsPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const listingId = params.id as string;
  const chatId = searchParams.get("chatId");
  const from = searchParams.get("from");

  const [ownerId, setOwnerId] = useState("");
  const [listingTitle, setListingTitle] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [loadingOwner, setLoadingOwner] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoadingOwner(true);
        const res = await api.get<ListingOwnerResponse>(`/listings/${listingId}`);
        setOwnerId(res.data?.listing?.owner?._id || "");
        setListingTitle(res.data?.listing?.title || "");
      } catch (error) {
        console.error("Failed to fetch listing owner", error);
        setOwnerId("");
        setListingTitle("");
      } finally {
        setLoadingOwner(false);
      }
    };

    if (listingId) {
      fetchListing();
    }
  }, [listingId]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {from === "chat" && chatId && (
            <Link
              href={`/messages/${chatId}`}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#8A715D] hover:text-[#8A715D]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to chat
            </Link>
          )}

          <Link
            href={`/listings/${listingId}`}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#8A715D] hover:text-[#8A715D]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to listing
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-gradient-to-r from-[#111827] via-[#1f2937] to-[#2f3b4d] px-6 py-8 text-white sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm text-white/70">Share your experience</p>
                <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                  Rate this Seller
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-white/75 sm:text-base">
                  Leave a genuine review based on your conversation and experience
                  with this seller.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/90">
                <ShieldCheck className="h-4 w-4" />
                Honest feedback helps others
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="mb-8 rounded-3xl border border-gray-200 bg-[#fafafa] p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Listing review page
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-gray-900 sm:text-2xl">
                    {listingTitle || "Listing Review"}
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Rate the seller and see the seller’s overall public reviews.
                  </p>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4 shadow-sm ring-1 ring-gray-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8A715D] text-white">
                    <Star className="h-5 w-5 fill-current" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Seller reviews
                    </p>
                    <p className="text-xs text-gray-500">
                      Public buyer feedback
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <section className="min-w-0">
                <ReviewForm
                  listingId={listingId}
                  onSubmitted={() => setRefreshKey((prev) => prev + 1)}
                />
              </section>

              <aside className="rounded-3xl border border-gray-200 bg-[#fafafa] p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
                  <MessageSquareText className="h-6 w-6 text-[#8A715D]" />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  Why your review matters
                </h3>

                <p className="mt-2 text-sm leading-7 text-gray-600">
                  Reviews help buyers know who they can trust, and they also help
                  good sellers build stronger credibility on Velora.
                </p>

                <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                  <p className="text-sm text-gray-700">
                    Keep your feedback clear, honest, and based on your real
                    experience.
                  </p>
                </div>
              </aside>
            </div>

            {!loadingOwner && ownerId ? (
              <div className="mt-8">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Seller rating summary
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    See the seller’s overall review score and public feedback.
                  </p>
                </div>

                <ReviewsList ownerId={ownerId} refreshKey={refreshKey} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}