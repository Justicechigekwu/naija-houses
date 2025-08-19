"use client";

import { useRef } from "react";
import { Camera } from "lucide-react";
import api from "@/libs/api";

type Props = {
  user: any;
  onAvatarUpdated: (avatar: string) => void;
};

export default function ProfileAvatar({ user, onAvatarUpdated }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatar = user?.avatar ? `${process.env.NEXT_PUBLIC_API_URL}${user.avatar}` : "/default-avatar.png";


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const formData = new FormData();
    formData.append("avatar", e.target.files[0]);

    try {
      const res = await api.put("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onAvatarUpdated(res.data.avatar);
    } catch (err) {
      console.error("Failed to upload avatar", err);
    }
  };

  return (
    <div className="flex justify-center mb-6 relative">
      <img
        src={avatar}
        alt="Profile Avatar"
        className="w-32 h-32 rounded-full object-cover border"
      />
      <button
        type="button"
        className="absolute bottom-2 right-[35%] bg-white p-2 rounded-full shadow"
        onClick={() => fileInputRef.current?.click()}
      >
        <Camera className="w-5 h-5 text-gray-600" />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
}
