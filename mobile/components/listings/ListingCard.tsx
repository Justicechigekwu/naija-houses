import { Pressable, Text, View, Image } from "react-native";
import { useRouter } from "expo-router";
import { MapPin } from "lucide-react-native";
import type { Listing } from "@/types/listing";
import { useTheme } from "@/hooks/useTheme";

function formatDistance(distanceMeters?: number) {
  if (!distanceMeters || distanceMeters <= 0 || distanceMeters > 900000000) {
    return "";
  }

  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)}m away`;
  }

  return `${(distanceMeters / 1000).toFixed(1)}km away`;
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const router = useRouter();
  const { colors, resolvedTheme } = useTheme();

  const title = listing.title || "Untitled listing";
  const price = Number(listing.price || 0);
  const image = listing.images?.[0]?.url;
  const city = listing.city || "";
  const state = listing.state || "";

  return (
    <Pressable
      onPress={() => {
        if (listing.slug) {
          router.push({
            pathname: "/listings/[slug]",
            params: { slug: listing.slug },
          } as any);
          return;
        }
      
        console.warn("Listing slug is missing for:", listing._id);
      }}
      style={{
        width: "100%",
        marginBottom: 4,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: colors.surface,
        borderWidth: resolvedTheme === "dark" ? 1 : 0,
        borderColor: colors.border,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: resolvedTheme === "dark" ? 0.12 : 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      }}
    >
      <View
        style={{
          width: "100%",
          aspectRatio: 4 / 3,
          backgroundColor: resolvedTheme === "dark" ? "#11161D" : "#F3F4F6",
        }}
      >
        <Image
          source={{
            uri: image || "https://via.placeholder.com/400x300",
          }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>

      <View style={{ paddingHorizontal: 6, paddingTop: 2, paddingBottom: 4 }}>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 15,
            fontWeight: "400",
            lineHeight: 20,
            color: colors.text,
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            marginTop: 6,
            fontSize: 14,
            fontWeight: "600",
            color: colors.success,
          }}
        >
          ₦{price.toLocaleString()}
        </Text>

        <View
          style={{
            marginTop: 6,
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <MapPin size={12} color={colors.text} style={{ marginRight: 4 }} />

          <Text style={{ fontSize: 11, color: colors.text }}>
            {[city, state].filter(Boolean).join(", ")}
          </Text>

          {listing.distanceMeters ? (
            <>
              <Text style={{ marginHorizontal: 4, fontSize: 11, color: colors.muted }}>
                •
              </Text>
              <Text style={{ fontSize: 11, fontWeight: "500", color: colors.brand }}>
                {formatDistance(listing.distanceMeters)}
              </Text>
            </>
          ) : null}
        </View>

        <View
          style={{
            marginTop: 6,
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {listing.attributes?.condition ? (
            <>
              <Text style={{ fontSize: 11, color: colors.muted }}>
                {String(listing.attributes.condition)}
              </Text>
              <Text style={{ marginHorizontal: 4, fontSize: 11, color: colors.muted }}>
                •
              </Text>
            </>
          ) : null}

          <Text style={{ fontSize: 11, color: colors.muted }}>
            Posted by {listing.postedBy || "Owner"}
          </Text>

          {listing.listingType ? (
            <>
              <Text style={{ marginHorizontal: 4, fontSize: 11, color: colors.muted }}>
                •
              </Text>
              <Text style={{ fontSize: 11, color: colors.muted }}>
                {listing.listingType}
              </Text>
            </>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}