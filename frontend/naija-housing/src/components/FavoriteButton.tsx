"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/libs/api";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/hooks/useUi";

interface FavoriteButtonProps {
  listingId: string;
  className?: string;
  iconClassName?: string;
  showText?: boolean;
}

export default function FavoriteButton({
  listingId,
  className = "",
  iconClassName = "",
  showText = false,
}: FavoriteButtonProps) {
  const router = useRouter();
  const { user, token } = useAuth();

  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const  { showToast } = useUI();

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user || !token || !listingId) return;

      try {
        setChecking(true);
        const res = await api.get(`/favorites/${listingId}/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsFavorited(res.data.isFavorited);
      } catch (error) {
        console.error("Failed to check favorite status:", error);
      } finally {
        setChecking(false);
      }
    };

    checkFavoriteStatus();
  }, [listingId, user, token]);

  const handleToggleFavorite = async () => {
    if (!user || !token) {
      router.push(`/login?redirect=/listings/${listingId}`);
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(
        `/favorites/${listingId}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsFavorited(res.data.isFavorited);
    } catch (error: any) {
      console.error("Failed to toggle favorite:", error);
      showToast(error?.response?.data?.message || "Failed to update favorite", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggleFavorite}
      disabled={loading || checking}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 transition hover:bg-gray-100 disabled:opacity-60 ${className}`}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`h-5 w-5 transition ${
          isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
        } ${iconClassName}`}
      />
      {showText && (
        <span className="text-sm font-medium">
          {checking ? "Loading..." : isFavorited ? "Saved" : "Save"}
        </span>
      )}
    </button>
  );
}