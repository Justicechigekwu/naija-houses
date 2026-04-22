import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, MapPin, ShieldCheck, Star } from "lucide-react-native";

import AppScreen from "@/components/ui/AppScreen";
import LoadingScreen from "@/components/ui/LoadingScreen";
import PublicUserListingsSection from "@/components/public-profile/PublicUserListingsSection";
import PublicRatingsCard from "@/components/public-profile/PublicRatingsCard";
import { getPublicProfileBySlug, type PublicProfile } from "@/features/public-profile/api";
import { useAuthStore } from "@/store/auth-store";
import { useTheme } from "@/hooks/useTheme";

function InfoBlock({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  const { colors, resolvedTheme } = useTheme();

  if (!value?.trim()) return null;

  return (
    <View
      className="rounded-2xl border p-4"
      style={{
        borderColor: colors.border,
        backgroundColor: resolvedTheme === "dark" ? colors.surface : "#fafafa",
      }}
    >
      <Text
        className="text-[11px] font-semibold uppercase"
        style={{ color: colors.muted }}
      >
        {label}
      </Text>
      <Text className="mt-2 text-sm leading-6" style={{ color: colors.text }}>
        {value}
      </Text>
    </View>
  );
}

export default function PublicProfileScreen() {
  const { slug, listingSlug } = useLocalSearchParams<{
    slug: string;
    listingSlug?: string;
  }>();
  const router = useRouter();
  const { colors } = useTheme();
  const authUser = useAuthStore((state) => state.user);

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    if (authUser?.slug && authUser.slug === slug) {
      router.replace("/profile" as any);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await getPublicProfileBySlug(String(slug));
        setProfile(res || null);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [slug, authUser?.slug, router]);

  const fullName = useMemo(() => {
    return `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim();
  }, [profile?.firstName, profile?.lastName]);

  if (loading) return <LoadingScreen />;

  if (!profile) {
    return (
      <AppScreen scroll padded>
        <View
          className="rounded-3xl border p-8"
          style={{ borderColor: colors.border, backgroundColor: colors.surface }}
        >
          <View className="items-center">
            <View
              className="h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: "#FEF2F2" }}
            >
              <ShieldCheck size={28} color="#DC2626" />
            </View>
            <Text className="mt-4 text-xl font-semibold" style={{ color: colors.text }}>
              User not found
            </Text>
            <Text className="mt-2 text-center text-sm" style={{ color: colors.muted }}>
              The profile you are trying to view is unavailable.
            </Text>

            <Pressable
              onPress={() => router.replace("/" as any)}
              className="mt-6 rounded-2xl px-5 py-3"
              style={{ backgroundColor: colors.brand }}
            >
              <Text className="font-semibold text-white">Go back home</Text>
            </Pressable>
          </View>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen scroll padded>
      {listingSlug ? (
        <Pressable
          onPress={() => router.push(`/listings/${listingSlug}` as any)}
          className="mb-4 flex-row items-center self-start rounded-xl border px-4 py-2"
          style={{ borderColor: colors.border, backgroundColor: colors.surface }}
        >
          <ArrowLeft size={16} color={colors.text} />
          <Text className="ml-2 text-sm font-medium" style={{ color: colors.text }}>
            Back to listing
          </Text>
        </Pressable>
      ) : null}

      <View
        className="overflow-hidden rounded-[28px]"
        style={{ backgroundColor: "#1F2937" }}
      >
        <View className="items-center px-5 pb-7 pt-7">
          <Image
            source={{
              uri: profile.avatar || "https://via.placeholder.com/200x200?text=User",
            }}
            style={{ width: 104, height: 104, borderRadius: 52 }}
            contentFit="cover"
          />

          <Text className="mt-4 text-xl font-semibold text-white">
            {fullName || "Unknown User"}
          </Text>

          {profile.location ? (
            <View className="mt-2 flex-row items-center rounded-full bg-white/10 px-3 py-1.5">
              <MapPin size={14} color="#FFFFFF" />
              <Text className="ml-1 text-sm text-white">{profile.location}</Text>
            </View>
          ) : null}

          <View className="mt-4 flex-row items-center rounded-2xl bg-white/10 px-4 py-3">
            <Star size={18} color="#FACC15" fill="#FACC15" />
            <View className="ml-2">
              <Text className="text-sm font-medium text-white">
                {(profile.averageRating || 0).toFixed(1)} rating
              </Text>
              <Text className="text-xs text-white/75">
                {profile.totalReviews || 0} review
                {(profile.totalReviews || 0) === 1 ? "" : "s"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="mt-5 gap-4">
        <InfoBlock label="Name" value={fullName} />
        <InfoBlock label="About" value={profile.bio} />
        <InfoBlock label="Contact" value={profile.phone} />
        <InfoBlock label="Address" value={profile.location} />

        <PublicRatingsCard
          slug={profile.slug}
          averageRating={profile.averageRating || 0}
          totalReviews={profile.totalReviews || 0}
        />
      </View>

      <View
        className="mt-6 rounded-[28px] border p-4"
        style={{ borderColor: colors.border, backgroundColor: colors.surface }}
      >
        <Text className="text-xl font-semibold" style={{ color: colors.text }}>
          Active listings
        </Text>
        <Text className="mt-1 text-sm" style={{ color: colors.muted }}>
          Browse currently available listings from this user.
        </Text>

        <View className="mt-5">
          <PublicUserListingsSection userId={profile.id} />
        </View>
      </View>
    </AppScreen>
  );
}