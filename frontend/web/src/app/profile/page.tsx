"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  FileText,
  Heart,
  Clock3,
  Star,
  Bell,
  Hourglass,
  Settings,
  ChevronRight,
  ArrowLeft
} from "lucide-react";

import ProfileAvatar from "@/components/ProfileAvatar";
import ProfileDetails from "@/components/ProfileDetails";
import UserListings from "@/components/UserListings";
import api from "@/libs/api";
import PageReadyLoader from "@/components/pages/PageReadyLoader";
import { AxiosError } from "axios";

type ErrorResponse = {
  message?: string;
};

type Profile = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get<Profile>("/profile");
        setProfile(res.data);
      } catch (error: unknown) {
        const err = error as AxiosError<ErrorResponse>;
        console.error("Failed to fetch profile", err.response?.data?.message);
      } finally {
        setReady(true);
      }
    };

    fetchProfile();
  }, []);

  const handleAvatarUpdate = (newAvatar: string) => {
    setProfile((prev) => (prev ? { ...prev, avatar: newAvatar } : prev));
  };

  const menuItems = [
    {
      href: "/messages",
      label: "My messages",
      icon: <MessageCircle className="h-4 w-4" />,
    },
    {
      href: "/drafts",
      label: "Drafts",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      href: "/favorites",
      label: "Favorites",
      icon: <Heart className="h-4 w-4" />,
    },
    {
      href: "/expired",
      label: "Expired listings",
      icon: <Clock3 className="h-4 w-4" />,
    },
    {
      href: "/feedback",
      label: "Feedbacks",
      icon: <Star className="h-4 w-4" />,
    },
    {
      href: "/notification",
      label: "Notifications",
      icon: <Bell className="h-4 w-4" />,
    },
    {
      href: "/pending",
      label: "Pending listings",
      icon: <Hourglass className="h-4 w-4" />,
    },
  ];

  return (
    <PageReadyLoader ready={ready}>
      <main className="min-h-screen bg-[#F5F5F5] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="self-start overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gradient-to-b from-[#FAF8F6] to-white p-6">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#8A715D] hover:text-[#8A715D]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to home
                </Link>
                {profile && (
                  <div className="flex flex-col items-center text-center">
                    <ProfileAvatar
                      user={profile}
                      onAvatarUpdated={handleAvatarUpdate}
                    />

                    <div className="mt-5 w-full">
                      <ProfileDetails user={profile} />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  {menuItems.map((item, index) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-4 py-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900 ${
                        index !== menuItems.length - 1
                          ? "border-b border-gray-200"
                          : ""
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-gray-500">{item.icon}</span>
                        {item.label}
                      </span>

                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                  ))}
                </div>

                <div className="mt-4">
                  <Link
                    href="/profile/update"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#8A715D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7A6352]"
                  >
                    <Settings className="h-4 w-4" />
                    Profile Settings
                  </Link>
                </div>
              </div>
            </aside>

            <section className="min-w-0 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                <h2 className="text-xl font-semibold text-center text-gray-900 sm:text-2xl">
                  Your Listings
                </h2>
              </div>

              <div className="px-5 py-6 sm:px-6">
                {profile && <UserListings userId={profile.id} />}
              </div>
            </section>
          </div>
        </div>
      </main>
    </PageReadyLoader>
  );
}