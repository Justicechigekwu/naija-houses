import { useEffect, useState } from "react";
import { Pressable, Text } from "react-native";
import { Heart } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { useUI } from "@/hooks/useUI";
import {
  checkFavoriteStatus,
  toggleFavorite,
} from "@/features/favorites/api";
import { useTheme } from "@/hooks/useTheme";

type Props = {
  listingId: string;
  showText?: boolean;
};

export default function FavoriteButton({
  listingId,
  showText = false,
}: Props) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { showToast } = useUI();
  const { colors } = useTheme();

  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (!user || !listingId) return;

      try {
        setChecking(true);
        const res = await checkFavoriteStatus(listingId);
        setIsFavorited(res.isFavorited);
      } catch {
        //
      } finally {
        setChecking(false);
      }
    };

    checkStatus();
  }, [listingId, user]);

  const handleToggle = async () => {
    if (!user) {
      router.push({
        pathname: "/login",
        params: { redirect: `/listings/${listingId}` },
      } as any);
      return;
    }

    try {
      setLoading(true);
      const res = await toggleFavorite(listingId);
      setIsFavorited(res.isFavorited);
      showToast(res.message, "success");
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Failed to update favorite",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={handleToggle}
      disabled={loading || checking}
      className="flex-row items-center gap-2 rounded-full px-3 py-2"
      style={{
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Heart
        size={18}
        color={isFavorited ? colors.danger : colors.muted}
        fill={isFavorited ? colors.danger : "transparent"}
      />
      {showText ? (
        <Text className="text-sm font-medium" style={{ color: colors.text }}>
          {checking ? "Loading..." : isFavorited ? "Saved" : "Save"}
        </Text>
      ) : null}
    </Pressable>
  );
}