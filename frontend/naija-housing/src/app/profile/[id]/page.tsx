"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import api from "@/libs/api";
import Link from "next/link";
import PublicProfileDetails from "@/components/PublicProfileDetails";
import PublicUserListings from "@/components/PublicUserListings";
import StarRating from "@/components/reviews/StarRating";
import { useAuth } from "@/context/AuthContext";
import { ChevronRight, MapPin, ShieldCheck, Star } from "lucide-react";
import { ArrowLeft,} from "lucide-react";

type PublicProfile = {
  id: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  location?: string;
  totalReviews?: number;
  averageRating?: number;
};

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listingId");
  const { user } = useAuth();

  const id = params?.id as string;

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    if (user?.id && user.id === id) {
      router.replace("/profile");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/profile/public/${id}`);
        setProfile(res.data);
      } catch (error) {
        console.error("Failed to fetch public profile", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, user?.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="mb-6 h-8 w-52 rounded bg-gray-200" />
          <div className="grid items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mx-auto h-28 w-28 rounded-full bg-gray-200" />
              <div className="mt-5 h-6 w-40 mx-auto rounded bg-gray-200" />
              <div className="mt-3 h-4 w-28 mx-auto rounded bg-gray-200" />
              <div className="mt-6 space-y-3">
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-5/6 rounded bg-gray-200" />
                <div className="h-4 w-2/3 rounded bg-gray-200" />
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-6 h-7 w-40 rounded bg-gray-200" />
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-2xl border border-gray-100 p-4"
                  >
                    <div className="h-24 w-24 rounded-2xl bg-gray-200" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 w-3/4 rounded bg-gray-200" />
                      <div className="h-4 w-1/3 rounded bg-gray-200" />
                      <div className="h-4 w-1/4 rounded bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">
            User not found
          </h2>
          <p className="mt-2 text-gray-600">
            The profile you are trying to view is unavailable.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center rounded-xl bg-[#8A715D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#755e4d]"
          >
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const fullName = `${profile.firstName || ""} ${profile.lastName || ""}`.trim();

  return (
    <div className="min-h-screen bg-[#f5f5f5] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {listingId && (
          <Link
            href={`/listings/${listingId}`}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#8A715D] hover:text-[#8A715D]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to listing
          </Link>
        )}
        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="self-start overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#2f3b4d] px-6 pb-8 pt-8 text-white">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <img
                    src={profile.avatar || "/default-avatar.png"}
                    alt={fullName}
                    className="h-28 w-28 rounded-full border-4 border-white/20 object-cover shadow-lg"
                  />
                  <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-[#111827] bg-emerald-500" />
                </div>

                <h2 className="mt-4 text-xl font-semibold">{fullName}</h2>

                {profile.location && (
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm text-white/90">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                )}

                <div className="mt-5 flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3">
                  <Star className="h-5 w-5 fill-current text-yellow-400" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-white">
                      {(profile.averageRating || 0).toFixed(1)} rating
                    </div>
                    <div className="text-xs text-white/75">
                      {profile.totalReviews || 0} review
                      {(profile.totalReviews || 0) === 1 ? "" : "s"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <PublicProfileDetails user={profile} />

              <Link
                href={`/profile/${profile.id}/reviews`}
                className="mt-6 block rounded-2xl border border-gray-200 bg-[#fafafa] p-4 transition hover:border-[#8A715D]/30 hover:bg-[#f7f4f1]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Ratings & Reviews
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      See what buyers and sellers are saying
                    </p>
                  </div>

                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <StarRating value={profile.averageRating || 0} size={18} />
                  <span className="text-sm font-medium text-gray-700">
                    {(profile.averageRating || 0).toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({profile.totalReviews || 0})
                  </span>
                </div>
              </Link>
            </div>
          </aside>

          <section className="self-start h-fit overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-5">
              <h2 className="text-xl font-semibold text-gray-900">
                Active listings
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Browse currently available listings from this user.
              </p>
            </div>

            <div className="p-6">
              <PublicUserListings userId={profile.id} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}