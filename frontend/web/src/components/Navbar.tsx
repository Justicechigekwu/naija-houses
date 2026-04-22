"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  useSearch,
  type Filters,
  type SearchSuggestion,
} from "@/context/SearchContext";
import useSocketNotifications from "@/hooks/useSocketNotifications";
import useUnreadMessages from "@/hooks/useUnreadMessage";
import {
  MessageSquare,
  User,
  Bell,
  LogOut,
  LayoutDashboard,
  Heart,
  FileText,
  PlusCircle,
  X,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import IconWithBadge from "./ui/IconWithBadge";
import NotificationBell from "@/components/NotificationBell";

type SearchSuggestionItem = SearchSuggestion & {
  slug?: string;
};

type SearchInputProps = {
  mobile?: boolean;
  className?: string;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  showSuggestions: boolean;
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  suggestions: SearchSuggestionItem[];
  handleSelect: (listing: SearchSuggestionItem) => void;
  searchRef: React.RefObject<HTMLDivElement | null>;
};

function SearchInput({
  className = "",
  filters,
  setFilters,
  showSuggestions,
  setShowSuggestions,
  suggestions,
  handleSelect,
  searchRef,
}: SearchInputProps) {
  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <input
        type="search"
        value={filters.search || ""}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, search: e.target.value }))
        }
        placeholder="What are you looking for?"
        className="w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 py-2.5 text-sm outline-none transition focus:border-[#8A715D] focus:bg-white"
        onFocus={() => {
          if (filters.search?.trim()) {
            setShowSuggestions(true);
          }
        }}
      />

      {showSuggestions && (
        <div className="absolute top-full z-[80] mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-xl">
          {suggestions.length > 0 ? (
            suggestions.map((item) => (
              <div
                key={item._id}
                onClick={() => handleSelect(item)}
                className="flex cursor-pointer items-center gap-3 px-3 py-3 transition hover:bg-gray-50"
              >
                <img
                  src={item.images?.[0]?.url || "/placeholder.jpg"}
                  alt={item.title}
                  className="h-11 w-11 rounded-xl object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {item.title}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {item.city}, {item.state}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="p-4 text-sm text-gray-500">
              No results found. Perhaps you can double check your spelling.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();
  const { user, isHydrated, logout } = useAuth();
  const { filters, setFilters, searchListings, suggestions } = useSearch();

  const unreadMessages = useUnreadMessages();
  const [notificationCount, setNotificationCount] = useState(0);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const desktopSearchRef = useRef<HTMLDivElement | null>(null);
  const mobileSearchRef = useRef<HTMLDivElement | null>(null);
  const desktopMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuPanelRef = useRef<HTMLDivElement | null>(null);

  useSocketNotifications({
    onUnreadCount: (payload) => {
      setNotificationCount(payload?.unreadCount || 0);
    },
  });

  const hasUnreadActivity = unreadMessages > 0 || notificationCount > 0;

  const handleSellClick = () => {
    if (!isHydrated) return;

    if (!user) {
      router.push("/login?redirect=/listings/create");
    } else {
      router.push("/listings/create");
    }

    setDesktopMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const closeAllMenus = () => {
    setDesktopMenuOpen(false);
    setMobileMenuOpen(false);
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
      const target = event.target as Node;

      const clickedOutsideDesktopSearch =
        !desktopSearchRef.current ||
        !desktopSearchRef.current.contains(target);

      const clickedOutsideMobileSearch =
        !mobileSearchRef.current ||
        !mobileSearchRef.current.contains(target);

      if (clickedOutsideDesktopSearch && clickedOutsideMobileSearch) {
        setShowSuggestions(false);
      }

      if (
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(target)
      ) {
        setDesktopMenuOpen(false);
      }

      if (
        mobileMenuPanelRef.current &&
        !mobileMenuPanelRef.current.contains(target)
      ) {
        const clickedBackdrop =
          target instanceof Element
            ? target.closest('[aria-label="Close menu backdrop"]')
            : null;

        if (clickedBackdrop) {
          setMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  const handleSelect = (listing: Pick<SearchSuggestionItem, "_id" | "slug">) => {
    setShowSuggestions(false);
    setFilters((prev) => ({ ...prev, search: "" }));

    const href = listing.slug
      ? `/listings/${listing.slug}`
      : `/listings/${listing._id}`;

    router.push(href);

    closeAllMenus();
  };

  const handleLogout = async () => {
    try {
      if (typeof logout === "function") {
        await logout();
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      closeAllMenus();
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="hidden md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:gap-6">
            <Link
              href="/"
              className="block text-2xl font-bold tracking-tight text-[#8A715D] sm:text-3xl"
            >
              Velora
            </Link>

            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                <SearchInput
                  filters={filters}
                  setFilters={setFilters}
                  showSuggestions={showSuggestions}
                  setShowSuggestions={setShowSuggestions}
                  suggestions={suggestions as SearchSuggestionItem[]}
                  handleSelect={handleSelect}
                  searchRef={desktopSearchRef}
                />
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={handleSellClick}
                className="rounded-xl bg-[#8A715D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7A6352]"
              >
                Sell
              </button>

              {user && (
                <>
                  <div className="relative inline-flex text-gray-700 hover:text-[#8A715D]">
                    <NotificationBell />
                    {notificationCount > 0 && (
                      <span className="absolute -right-1 -top-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold leading-none text-white">
                        {notificationCount > 9 ? "9+" : notificationCount}
                      </span>
                    )}
                  </div>

                  <Link
                    href="/messages"
                    className="text-gray-700 hover:text-[#8A715D]"
                  >
                    <IconWithBadge count={unreadMessages}>
                      <MessageSquare className="h-6 w-6" />
                    </IconWithBadge>
                  </Link>
                </>
              )}

              {!user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-gray-700 transition hover:text-[#8A715D]"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-[#8A715D] hover:text-[#8A715D]"
                  >
                    Sign up
                  </Link>
                </div>
              ) : (
                <div ref={desktopMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setDesktopMenuOpen((prev) => !prev)}
                    className="flex items-center gap-3 rounded-full border border-gray-200 bg-white p-1.5 transition hover:border-[#8A715D]/40 hover:shadow-sm"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="avatar"
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                  </button>

                  {desktopMenuOpen && (
                    <div className="absolute right-0 top-[calc(100%+10px)] z-[90] w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                      <div className="border-b border-gray-100 px-4 py-4">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.firstName || "Velora User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Manage your account
                        </p>
                      </div>

                      <div className="p-2">
                        <Link
                          href="/profile"
                          onClick={() => setDesktopMenuOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#8A715D]"
                        >
                          <User className="h-4 w-4" />
                          My Profile
                        </Link>

                        <Link
                          href="/messages"
                          onClick={() => setDesktopMenuOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#8A715D]"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Messages
                          {unreadMessages > 0 && (
                            <span className="ml-auto rounded-full bg-[#8A715D] px-2 py-0.5 text-xs text-white">
                              {unreadMessages > 9 ? "9+" : unreadMessages}
                            </span>
                          )}
                        </Link>

                        <Link
                          href="/favorites"
                          onClick={() => setDesktopMenuOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#8A715D]"
                        >
                          <Heart className="h-4 w-4" />
                          Favorites
                        </Link>

                        <Link
                          href="/drafts"
                          onClick={() => setDesktopMenuOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#8A715D]"
                        >
                          <FileText className="h-4 w-4" />
                          Drafts
                        </Link>

                        <Link
                          href="/profile/update"
                          onClick={() => setDesktopMenuOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#8A715D]"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Profile Settings
                        </Link>

                        <Link
                          href="/notification"
                          onClick={() => setDesktopMenuOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#8A715D]"
                        >
                          <Bell className="h-4 w-4" />
                          Notifications
                          {notificationCount > 0 && (
                            <span className="ml-auto rounded-full bg-[#8A715D] px-2 py-0.5 text-xs text-white">
                              {notificationCount > 9 ? "9+" : notificationCount}
                            </span>
                          )}
                        </Link>

                        <button
                          type="button"
                          onClick={handleSellClick}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#8A715D]"
                        >
                          <PlusCircle className="h-4 w-4" />
                          Sell an item
                        </button>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 md:hidden">
            <Link
              href="/"
              className="block text-2xl font-bold tracking-tight text-[#8A715D]"
            >
              Velora
            </Link>

            <div className="min-w-0">
              <SearchInput
                mobile
                filters={filters}
                setFilters={setFilters}
                showSuggestions={showSuggestions}
                setShowSuggestions={setShowSuggestions}
                suggestions={suggestions as SearchSuggestionItem[]}
                handleSelect={handleSelect}
                searchRef={mobileSearchRef}
              />
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:border-[#8A715D]/40 hover:shadow-sm"
              >
                {user ? (
                  user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  )
                ) : (
                  <User className="h-5 w-5 text-gray-600" />
                )}

                {user && hasUnreadActivity && (
                  <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-red-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[120] md:hidden">
          <button
            type="button"
            aria-label="Close menu backdrop"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/25"
          />

          <div
            ref={mobileMenuPanelRef}
            className="absolute right-4 top-[72px] w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
              <div className="flex items-center gap-3 min-w-0">
                {user ? (
                  user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  )
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {user ? user.firstName || "Velora User" : "Welcome"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user ? "My account" : "Access your account"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!user ? (
              <div className="p-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#8A715D]"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl bg-[#8A715D] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#7A6352]"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="p-2">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#8A715D]"
                >
                  <User className="h-4 w-4" />
                  My Profile
                </Link>

                <Link
                  href="/messages"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#8A715D]"
                >
                  <MessageSquare className="h-4 w-4" />
                  Messages
                  {unreadMessages > 0 && (
                    <span className="ml-auto rounded-full bg-[#8A715D] px-2 py-0.5 text-xs text-white">
                      {unreadMessages > 9 ? "9+" : unreadMessages}
                    </span>
                  )}
                </Link>

                <Link
                  href="/favorites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#8A715D]"
                >
                  <Heart className="h-4 w-4" />
                  Favorites
                </Link>

                <Link
                  href="/drafts"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#8A715D]"
                >
                  <FileText className="h-4 w-4" />
                  Drafts
                </Link>

                <Link
                  href="/profile/update"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#8A715D]"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Profile Settings
                </Link>

                <Link
                  href="/notification"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#8A715D]"
                >
                  <Bell className="h-4 w-4" />
                  Notifications
                  {notificationCount > 0 && (
                    <span className="ml-auto rounded-full bg-[#8A715D] px-2 py-0.5 text-xs text-white">
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                  )}
                </Link>

                <button
                  type="button"
                  onClick={handleSellClick}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#8A715D]"
                >
                  <PlusCircle className="h-4 w-4" />
                  Sell an item
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div> 
        </div>
      )}
    </>
  );
}