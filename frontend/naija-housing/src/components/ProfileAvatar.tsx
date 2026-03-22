"use client";

import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import api from "@/libs/api";

type Props = {
  user: any;
  onAvatarUpdated: (avatar: string) => void;
};

export default function ProfileAvatar({ user, onAvatarUpdated }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imgError, setImgError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const avatar = user?.avatar || "/default-avatar.png";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const formData = new FormData();
    formData.append("avatar", e.target.files[0]);

    try {
      setUploading(true);

      const res = await api.put("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onAvatarUpdated(res.data.user.avatar);
      setImgError(false);
    } catch (err) {
      console.error("Failed to upload avatar", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-center mb-6 relative">
      <img
        src={imgError ? "/default-avatar.png" : avatar}
        alt="Profile Avatar"
        className="w-32 h-32 rounded-full border object-cover"
        onError={() => setImgError(true)}
      />

      <button
        type="button"
        disabled={uploading}
        className="absolute bottom-2 right-[35%] bg-white p-2 rounded-full shadow disabled:opacity-50"
        onClick={() => fileInputRef.current?.click()}
      >
        <Camera className="w-5 h-5 text-gray-600" />
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/jpeg,image/png,image/jpg,image/webp"
      />
    </div>
  );
}