"use client";

import { useEffect, useState } from "react";
import ProfileAvatar from "@/components/ProfileAvatar";
import ProfileDetails from "@/components/ProfileDetails";
import UserListings from "@/components/UserListings";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/libs/api";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { logout, token } = useAuth();  
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

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleAvatarUpdate = (newAvatar: string) => {
    setProfile((prev: any) => ({ ...prev, avatar: newAvatar }));
  };

  return (
    
    <div className="flex bg-[#EDEDED] justify-center gap-4 p-6">

      <div className="w-[60%]">
        {profile && <UserListings userId={profile.id}/>}
      </div>

      <div className="w-[30%] bg-white p-6 shadow rounded flex flex-col">
        <div className="flex justify-end mb-4">
          <Link href="/profile/update">
            <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              Settings
            </button>
          </Link>
        </div>
          <ProfileAvatar user={profile} onAvatarUpdated={handleAvatarUpdate} />
          <ProfileDetails user={profile} />
          {token && (
            <button
            onClick={handleLogout}
            className="bg-red-500 mt-4 w-full text-white py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          )}
      </div>
    </div>
  );
}
