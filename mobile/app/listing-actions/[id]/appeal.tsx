import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import AppScreen from "@/components/ui/AppScreen";
import ListingForm from "@/components/listings/ListingForm";
import useAppealListing from "@/hooks/useAppealListing";
import { useUI } from "@/hooks/useUI";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";

const policyLinks: Record<string, string> = {
  PROHIBITED_ITEMS: "/prohibited-items",
  COMMUNITY_GUIDELINES: "/community-guidelines",
  TERMS: "/terms",
  SAFETY: "/safety-tips",
  FRAUD: "/safety-tips",
  OTHER: "/appeal-policy",
};

const policyLabels: Record<string, string> = {
  PROHIBITED_ITEMS: "Prohibited Items Policy",
  COMMUNITY_GUIDELINES: "Community Guidelines",
  TERMS: "Terms & Conditions",
  SAFETY: "Safety Tips",
  FRAUD: "Safety Tips",
  OTHER: "Appeal Policy",
};

export default function AppealScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const listingId = Array.isArray(params.id) ? params.id[0] : params.id || "";

  const router = useRouter();
  const { showToast } = useUI();
  const { colors } = useTheme();
  const { listing, loading, submitting, error, submitAppeal } =
    useAppealListing(listingId);

  const [appealMessage, setAppealMessage] = useState("");

  if (loading) {
    return (
      <AppScreen padded={false}>
        <View
          className="flex-1 items-center justify-center"
          style={{ backgroundColor: colors.background }}
        >
          <ActivityIndicator size="large" color={colors.brand} />
        </View>
      </AppScreen>
    );
  }

  if (!listing) {
    return (
      <AppScreen padded={false}>
        <View
          className="flex-1 items-center justify-center px-6"
          style={{ backgroundColor: colors.background }}
        >
          <Text style={{ color: colors.text }}>Listing not found.</Text>
        </View>
      </AppScreen>
    );
  }

  const policyKey = listing.violationPolicy || "OTHER";
  const policyHref =
    listing.policyRoute || policyLinks[policyKey] || "/appeal-policy";
  const policyLabel =
    listing.policyLabel || policyLabels[policyKey] || "Appeal Policy";

  const handleSubmit = async (formData: FormData) => {
    if (!appealMessage.trim()) {
      showToast("Please explain your appeal before submitting.", "error");
      return;
    }

    try {
      await submitAppeal(formData, appealMessage);
      showToast("Appeal submitted successfully", "success");
      router.replace("/notification" as any);
    } catch {
      showToast("Failed to submit appeal.", "error");
    }
  };

  return (
    <AppScreen padded={false}>
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          className="mb-6 text-2xl font-semibold"
          style={{ color: colors.text }}
        >
          Listing Appeal
        </Text>

        <View
          className="mb-5 rounded-2xl border p-4"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <Text
            className="mb-2 font-semibold"
            style={{ color: colors.text }}
          >
            Appeal listing removal
          </Text>
          <Text className="text-sm" style={{ color: colors.muted }}>
            Review your listing, make corrections if needed, and explain why it
            should be restored.
          </Text>
        </View>

        {listing.adminRemovalReason ? (
          <View
            className="mb-5 rounded-2xl border p-4"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.danger,
            }}
          >
            <Text
              className="text-sm font-medium"
              style={{ color: colors.danger }}
            >
              Removal reason
            </Text>
            <Text className="mt-2 text-sm" style={{ color: colors.text }}>
              {listing.adminRemovalReason}
            </Text>

            <Text className="mt-3 text-sm" style={{ color: colors.muted }}>
              Related policy: {policyLabel}
            </Text>
            <Text className="mt-1 text-sm" style={{ color: colors.brand }}>
              {policyHref}
            </Text>
          </View>
        ) : null}

        {error ? (
          <View
            className="mb-5 rounded-2xl border p-4"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.danger,
            }}
          >
            <Text style={{ color: colors.danger }}>{error}</Text>
          </View>
        ) : null}

        <View className="mb-5">
          <Text
            className="mb-2 text-sm font-medium"
            style={{ color: colors.text }}
          >
            Appeal message
          </Text>
          <TextInput
            value={appealMessage}
            onChangeText={setAppealMessage}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            placeholder="Explain what you changed and why the listing should be restored..."
            placeholderTextColor={colors.muted}
            className="min-h-[130px] rounded-2xl border px-4 py-3"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
              color: colors.text,
            }}
          />
        </View>

        <ListingForm
          initialData={listing}
          isEditMode={true}
          onSubmit={handleSubmit}
        />

        {submitting ? (
          <Text className="mt-4 text-sm" style={{ color: colors.muted }}>
            Submitting appeal...
          </Text>
        ) : null}
      </ScrollView>
    </AppScreen>
  );
}