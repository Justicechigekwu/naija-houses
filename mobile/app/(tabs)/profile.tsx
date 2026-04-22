import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import {
  Camera,
  Mail,
  User2,
  MapPin,
  Phone,
  CalendarDays,
  Info,
} from "lucide-react-native";
import { useUI } from "@/hooks/useUI";

import AppButton from "@/components/ui/AppButton";
import AppScreen from "@/components/ui/AppScreen";
import Avatar from "@/components/ui/Avatar";
import SettingRow from "@/components/ui/SettingRow";
import UserListings from "@/components/profile/UserListing";
import { useAuthStore } from "@/store/auth-store";
import { updateProfile } from "@/features/profile/api";
import {
  pickAvatarFromCamera,
  pickAvatarFromLibrary,
} from "@/features/profile/image-picker";
import { useTheme } from "@/hooks/useTheme";

function formatDisplayDate(value?: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toISOString().slice(0, 10);
}

function ProfileInfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | null;
  icon: React.ReactNode;
}) {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-start">
      {icon}
      <View className="ml-3 flex-1">
        <Text
          className="text-[12px] uppercase tracking-wide"
          style={{ color: colors.muted }}
        >
          {label}
        </Text>
        <Text
          className="mt-1 text-[15px] font-medium"
          style={{ color: colors.text }}
        >
          {value?.trim() ? value : "-"}
        </Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const { colors } = useTheme();
  const { showConfirm, showToast } = useUI();

  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

  const handleAvatarPress = () => {
    Alert.alert("Update Avatar", "Choose how you want to update your photo.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Take Photo",
        onPress: async () => {
          const file = await pickAvatarFromCamera();
          if (!file) return;

          try {
            setUploadingAvatar(true);
            const response = await updateProfile({ avatar: file });
            setUser(response.user);
          } catch (error: any) {
            showToast(
              error?.response?.data?.message ||
                error?.message ||
                "Failed to upload avatar.",
                "error"
            );
          } finally {
            setUploadingAvatar(false);
          }
        },
      },
      {
        text: "Choose from Library",
        onPress: async () => {
          const file = await pickAvatarFromLibrary();
          if (!file) return;

          try {
            setUploadingAvatar(true);
            const response = await updateProfile({ avatar: file });
            setUser(response.user);
          } catch (error: any) {
            showToast(
              error?.response?.data?.message ||
                error?.message ||
                "Failed to upload avatar.",
                "error"
            );
          } finally {
            setUploadingAvatar(false);
          }
        },
      },
    ]);
  };

  return (
    <AppScreen scroll padded={false}>
      <View
        className="flex-1 py-6"
        style={{ backgroundColor: colors.background }}
      >
        <View
          className="rounded-[28px] border py-5"
          style={{
            borderColor: colors.border,
            backgroundColor: colors.surface,
          }}
        >
          <View className="px-4">
            <View className="items-center">
              <Avatar uri={user?.avatar} name={fullName} size={110}>
                <Pressable
                  onPress={handleAvatarPress}
                  disabled={uploadingAvatar}
                  className="absolute bottom-0 left-1/2 ml-1 h-10 w-10 items-center justify-center rounded-full border"
                  style={{
                    transform: [{ translateX: -20 }],
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                  }}
                >
                  <Camera size={18} color={colors.text} />
                </Pressable>
              </Avatar>

              {uploadingAvatar ? (
                <Text className="mt-2 text-sm" style={{ color: colors.brand }}>
                  Uploading avatar...
                </Text>
              ) : null}
            </View>

            <View className="mt-8 gap-5">
              <ProfileInfoRow
                label="Username"
                value={fullName}
                icon={<User2 size={18} color={colors.muted} style={{ marginTop: 2 }} />}
              />

              <ProfileInfoRow
                label="Email"
                value={user?.email}
                icon={<Mail size={18} color={colors.muted} style={{ marginTop: 2 }} />}
              />

              <ProfileInfoRow
                label="Location"
                value={user?.location}
                icon={<MapPin size={18} color={colors.muted} style={{ marginTop: 2 }} />}
              />

              <ProfileInfoRow
                label="Phone"
                value={user?.phone}
                icon={<Phone size={18} color={colors.muted} style={{ marginTop: 2 }} />}
              />

              <ProfileInfoRow
                label="Date of Birth"
                value={formatDisplayDate(user?.dob)}
                icon={<CalendarDays size={18} color={colors.muted} style={{ marginTop: 2 }} />}
              />

              <ProfileInfoRow
                label="Gender"
                value={user?.sex}
                icon={<User2 size={18} color={colors.muted} style={{ marginTop: 2 }} />}
              />
            </View>

            <View
              className="mt-6 rounded-[22px] border p-4"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.background,
              }}
            >
              <View className="flex-row items-start">
                <Info size={18} color={colors.muted} style={{ marginTop: 2 }} />
                <View className="ml-3 flex-1">
                  <Text
                    className="text-[12px] uppercase tracking-wide"
                    style={{ color: colors.muted }}
                  >
                    About
                  </Text>
                  <Text
                    className="mt-2 text-[14px] leading-6"
                    style={{ color: colors.text }}
                  >
                    {user?.bio?.trim() || "No bio added yet."}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="mt-8 border-t" style={{ borderColor: colors.border }} />

          <View
            className="mx-4 mt-4 overflow-hidden rounded-[22px] border"
            style={{ borderColor: colors.border }}
          >
            <SettingRow label="My messages" onPress={() => router.push("/messages")} />
            <SettingRow label="Drafts" onPress={() => router.push("/drafts")} />
            <SettingRow label="Favorites" onPress={() => router.push("/favorites")} />
            <SettingRow label="Expired listings" onPress={() => router.push("/expired")} />
            <SettingRow label="Feedbacks" onPress={() => router.push("/feedback")} />
            <SettingRow label="Notifications" onPress={() => router.push("/notification")} />
            <SettingRow label="Pending listings" onPress={() => router.push("/pending")} />
          </View>

          <View className="px-4">
            <AppButton
              label="Profile Settings"
              onPress={() => router.push("/profile/settings")}
              className="mt-4 h-12 rounded-2xl"
              textClassName="text-[15px] font-semibold text-white"
            />
          </View>
        </View>

        {user?.id ? <UserListings userId={user.id} /> : null}
      </View>
    </AppScreen>
  );
}