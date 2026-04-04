"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import adminApi from "@/libs/adminApi";

type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string | null;
  createdAt?: string;
  badges: {
    total: number;
    active: number;
    pending: number;
    awaitingPayment: number;
    expired: number;
  };
};

type Listing = {
  _id: string;
  title?: string;
  category?: string;
  subcategory?: string;
  price?: number;
  publishStatus?: string;
  createdAt?: string;
  expiresAt?: string | null;
  daysLeft?: number;
};

export default function AdminUserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = params?.userId as string;
  const filter = useMemo(() => searchParams.get("filter") || "all", [searchParams]);

  const [user, setUser] = useState<AdminUser | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingListings, setLoadingListings] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    const loadUser = async () => {
      try {
        setLoadingUser(true);
        const res = await adminApi.get(`/admin/users/${userId}`);
        setUser(res.data);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          setError(err.response?.data?.message || "Failed to load user");
        } else {
          setError("Failed to load user");
        }
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const loadListings = async () => {
      try {
        setLoadingListings(true);
        const res = await adminApi.get(`/admin/users/${userId}/listings?filter=${filter}`);
        setListings(res.data);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          setError(err.response?.data?.message || "Failed to load listings");
        } else {
          setError("Failed to load listings");
        }
      } finally {
        setLoadingListings(false);
      }
    };

    loadListings();
  }, [userId, filter]);

  const setFilter = (nextFilter: string) => {
    router.push(`/admin/users/${userId}?filter=${nextFilter}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <button
        className="border px-3 py-2 rounded mb-4"
        onClick={() => router.push("/admin/dashboard")}
      >
        Back
      </button>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loadingUser ? (
        <div className="bg-white border rounded-xl p-4">Loading user details...</div>
      ) : user ? (
        <div className="bg-white border rounded-xl p-4 mb-6">
          <h1 className="text-2xl font-semibold">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-gray-600 mt-1">{user.email}</p>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              className="px-3 py-2 rounded bg-gray-200"
              onClick={() => setFilter("all")}
            >
              Total: {user.badges.total}
            </button>
            <button
              className="px-3 py-2 rounded bg-green-200"
              onClick={() => setFilter("active")}
            >
              Active: {user.badges.active}
            </button>
            <button
              className="px-3 py-2 rounded bg-yellow-200"
              onClick={() => setFilter("pending")}
            >
              Pending: {user.badges.pending}
            </button>
            <button
              className="px-3 py-2 rounded bg-blue-200"
              onClick={() => setFilter("awaiting")}
            >
              Awaiting: {user.badges.awaitingPayment}
            </button>
          </div>
        </div>
      ) : null}

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold capitalize">
            {filter === "all" ? "All Listings" : `${filter} Listings`}
          </h2>
        </div>

        {loadingListings ? (
          <div className="p-4">Loading listings...</div>
        ) : listings.length === 0 ? (
          <div className="p-4 text-gray-500">No listings found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Expires</th>
                <th className="text-left p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing._id} className="border-t">
                  <td className="p-3">{listing.title || "Untitled listing"}</td>
                  <td className="p-3">
                    {listing.category || "-"}
                    {listing.subcategory ? ` / ${listing.subcategory}` : ""}
                  </td>
                  <td className="p-3">{listing.publishStatus || "-"}</td>
                  <td className="p-3">
                    {listing.expiresAt
                      ? `${new Date(listing.expiresAt).toLocaleDateString()}${
                          listing.daysLeft ? ` (${listing.daysLeft} days left)` : ""
                        }`
                      : "-"}
                  </td>
                  <td className="p-3">
                    <button
                      className="border px-3 py-1 rounded"
                      onClick={() => router.push(`/admin/listings/${listing._id}`)}
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}