"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSearch } from "@/context/SearchContext";
import { MessageSquare } from "lucide-react";
import BadgeDot from "@/components/ui/BadgeDot";
import { useState, useEffect, useRef } from "react";
import useUnreadMessages from "@/hooks/useUnreadMessage";
import IconWithBadge from "./ui/IconWithBadge";
import NotificationBell from "@/components/NotificationBell";

export default function Navbar() {
  const hasUnreadMessages = false;
  const unreadCount = useUnreadMessages();
  const { filters, setFilters, searchListings, suggestions } = useSearch();
  const router = useRouter();
  const { user, isHydrated } = useAuth();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const handleSellClick = () => {
    if (!isHydrated) return;

    if (!user) {
      router.push("/login?redirect=/listings/create");
    } else {
      router.push("/listings/create");
    }
  };

  useEffect(() => {
    if (filters.search?.trim()) {
      const delayDebounce = setTimeout(() => {
        searchListings();
        setShowSuggestions(true);
      }, 400);

      return () => clearTimeout(delayDebounce);
    } else {
      setShowSuggestions(false);
    }
  }, [filters.search, searchListings]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (id: string) => {
    setShowSuggestions(false);
    setFilters({ ...filters, search: "" });
    router.push(`/listings/${id}`);
  };

  return (
    <nav className="bg-white shadow p-8 flex justify-between items-center">
      <Link href="/" className="text-3xl font-bold text-[#8A715D]">
        Velora
      </Link>

      <div ref={searchRef} className="flex-1 mx-4 flex relative">
        <input
          type="search"
          value={filters.search || ""}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
          placeholder="What are you looking for?"
          className="w-full border px-3 py-2 rounded-md"
          onFocus={() => {
            if (filters.search?.trim()) {
              setShowSuggestions(true);
            }
          }}
        />

        {showSuggestions && (
          <div className="absolute top-full mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto z-50">
            {suggestions.length > 0 ? (
              suggestions.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleSelect(item._id)}
                  className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100"
                >
                  <img
                    src={item.images?.[0]?.url || "/placeholder.jpg"}
                    alt={item.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-gray-500">
                      {item.location}, {item.state}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-3 text-sm text-gray-500">
                No results found.. Perhaps you can double check yours spellings
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4 items-center">
        <button
          onClick={handleSellClick}
          className="bg-[#8A715D] hover:bg-[#7A6352] text-white px-4 py-2 rounded"
        >
          Sell
        </button>

        <div className="relative inline-flex hover:text-green-600">
          <NotificationBell />
          <BadgeDot show={hasUnreadMessages} />
        </div>

        {user && (
          <Link href="/messages" className="hover:text-green-600">
            <IconWithBadge count={unreadCount}>
              <MessageSquare className="w-6 h-6" />
            </IconWithBadge>
          </Link>
        )}

        {!user ? (
          <>
            <Link href="/login" className="hover:text-green-600">
              Login
            </Link>
            <Link href="/register" className="hover:text-green-600">
              Register
            </Link>
          </>
        ) : (
          <Link href="/profile" className="flex items-center gap-3 hover:opacity-80">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300"></div>
              )}
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
}