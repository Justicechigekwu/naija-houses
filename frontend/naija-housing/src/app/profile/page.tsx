"use client";

import { useEffect, useState } from "react";
import ProfileAvatar from "@/components/ProfileAvatar";
import ProfileDetails from "@/components/ProfileDetails";
import UserListings from "@/components/UserListings";
import Link from "next/link";
import api from "@/libs/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");
        setProfile(res.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    fetchProfile();
  }, []);

  const handleAvatarUpdate = (newAvatar: string) => {
    setProfile((prev: any) => ({ ...prev, avatar: newAvatar }));
  };

  return (
    <div className="bg-[#EDEDED] min-h-screen p-6">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 items-start">
        
        <div className="w-full lg:w-[30%] bg-white rounded-2xl shadow overflow-hidden self-start">
          
          <div className="p-6 flex flex-col items-center text-center border-b">
            {profile && (
              <>
                <ProfileAvatar user={profile} onAvatarUpdated={handleAvatarUpdate} />
                <div className="mt-4 w-full">
                  <ProfileDetails user={profile} />
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col">
            <Link
              href="/messages"
              className="px-6 py-4 border-b hover:bg-gray-50 transition"
            >
              My messages
            </Link>

            <Link
              href="/drafts"
              className="px-6 py-4 border-b hover:bg-gray-50 transition"
            >
              Drafts
            </Link>

            <Link
              href="/favorites"
              className="px-6 py-4 border-b hover:bg-gray-50 transition"
            >
              Favorites
            </Link>

            <Link
              href="/expired"
              className="px-6 py-4 border-b hover:bg-gray-50 transition"
            >
              Expired listings
            </Link>

            <Link
              href="/feedback"
              className="px-6 py-4 border-b hover:bg-gray-50 transition"
            >
              Feedbacks
            </Link>

            <Link
              href="/notification"
              className="px-6 py-4 border-b hover:bg-gray-50 transition"
            >
              Notifications
            </Link>

            <Link
              href="/pending"
              className="px-6 py-4 border-b hover:bg-gray-50 transition"
            >
              Pending listings
            </Link>
          </div>

          <div className="p-6">
            <Link href="/profile/update">
              <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition">
                Settings
              </button>
            </Link>
          </div>
        </div>

        <div className="w-full lg:w-[70%] bg-white rounded-2xl shadow overflow-hidden">
          <div className="p-6">
            {profile && <UserListings userId={profile.id} />}
          </div>
        </div>
      </div>
    </div>
  );
}