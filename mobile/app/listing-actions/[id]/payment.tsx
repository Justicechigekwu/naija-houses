import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import AppScreen from "@/components/ui/AppScreen";
import { useTheme } from "@/hooks/useTheme";
import { useUI } from "@/hooks/useUI";
import { hexToRgba } from "@/libs/theme-utils";
import {
  choosePublishPlan,
  getPublishOptions,
} from "@/features/listings/publish-api";
import type { PublishOptionsResponse } from "@/types/marketplace";

export default function PublishPlanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { showToast } = useUI();

  const [opts, setOpts] = useState<PublishOptionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<null | "TRIAL_14_DAYS" | "PAID_30_DAYS">(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const data = await getPublishOptions(String(id));
        setOpts(data);
      } catch (error: any) {
        showToast(
          error?.response?.data?.message || "Failed to load publish options",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) run();
  }, [id, showToast]);

  const onChoose = async (plan: "TRIAL_14_DAYS" | "PAID_30_DAYS") => {
    try {
      setSubmitting(plan);

      const res = await choosePublishPlan(String(id), plan);

      if (plan === "PAID_30_DAYS") {
        const code = res?.payment?.paymentCode || "";
        router.replace(
          `/listing-actions/${id}/payment-details${code ? `?code=${encodeURIComponent(code)}` : ""}` as any
        );
        return;
      }

      const slug = res?.listing?.slug || res?.slug;
      if (!slug) {
        showToast("Listing was published but slug was not returned", "error");
        return;
      }

      showToast(res?.message || "Published successfully", "success");
      router.replace(`/listings/${slug}` as any);
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Failed to choose publish plan",
        "error"
      );
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <AppScreen scroll padded>
      <View
        className="overflow-hidden rounded-[28px]"
        style={{ backgroundColor: colors.surface }}
      >
        <View
          className="px-5 py-5"
          style={{
            backgroundColor: colors.background,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Text className="text-center text-2xl font-semibold" style={{ color: colors.text }}>
            Publish Listing
          </Text>
          <Text
            className="mt-2 text-center text-sm leading-6"
            style={{ color: colors.muted }}
          >
            {opts
              ? `Choose a plan to publish this listing. Free trials are limited to first-time ${opts.subcategory || "category"} users.`
              : "Choose a plan to publish this listing."}
          </Text>
        </View>

        {loading ? (
          <View className="items-center px-5 py-10">
            <ActivityIndicator color={colors.brand} />
            <Text className="mt-3 text-sm" style={{ color: colors.muted }}>
              Loading...
            </Text>
          </View>
        ) : !opts ? (
          <View className="px-5 py-10">
            <Text style={{ color: colors.muted }}>No options found.</Text>
          </View>
        ) : (
          <View className="p-4" style={{ backgroundColor: colors.background }}>
            <View
              className="mb-4 rounded-3xl border p-4"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <View className="flex-row items-start justify-between gap-4">
                <View className="flex-1">
                  <Text className="text-base font-semibold" style={{ color: colors.text }}>
                    14-days Free Plan
                  </Text>
                  <Text className="mt-1 text-sm leading-6" style={{ color: colors.muted }}>
                    Publish instantly for {opts.trialDays} days if trial is still available.
                  </Text>
                </View>

                <View
                  className="rounded-full px-3 py-1"
                  style={{ backgroundColor: colors.text }}
                >
                  <Text className="text-xs font-medium text-white">Free</Text>
                </View>
              </View>

              <Pressable
                disabled={!opts.canUseTrial || submitting !== null}
                onPress={() => onChoose("TRIAL_14_DAYS")}
                className="mt-4 items-center rounded-2xl px-4 py-3.5"
                style={{
                  backgroundColor: opts.canUseTrial
                    ? colors.text
                    : hexToRgba(colors.text, 0.35),
                }}
              >
                <Text className="text-sm font-semibold text-white">
                  {opts.canUseTrial
                    ? submitting === "TRIAL_14_DAYS"
                      ? "Applying..."
                      : "Try Free Plan"
                    : "Trial already used"}
                </Text>
              </Pressable>
            </View>

            <View
              className="rounded-3xl border p-4"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <View className="flex-row items-start justify-between gap-4">
                <View className="flex-1">
                  <Text className="text-sm" style={{ color: colors.muted }}>
                    Paid publish plan
                  </Text>
                  <Text className="mt-1 text-xl font-semibold" style={{ color: colors.text }}>
                    ₦{opts.price.toLocaleString()}
                  </Text>
                  <Text className="mt-1 text-sm leading-6" style={{ color: colors.muted }}>
                    Publish for {opts.paidDays} days.
                  </Text>
                </View>

                <View
                  className="rounded-full px-3 py-1"
                  style={{ backgroundColor: colors.brand }}
                >
                  <Text className="text-xs font-medium text-white">Paid</Text>
                </View>
              </View>

              <Pressable
                disabled={submitting !== null}
                onPress={() => onChoose("PAID_30_DAYS")}
                className="mt-4 items-center rounded-2xl px-4 py-3.5"
                style={{
                  backgroundColor:
                    submitting !== null ? hexToRgba(colors.brand, 0.45) : colors.brand,
                }}
              >
                <Text className="text-sm font-semibold text-white">
                  {submitting === "PAID_30_DAYS" ? "Continuing..." : "Proceed to Payment"}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </AppScreen>
  );
}