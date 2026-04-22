import { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Camera, FileText, Paperclip, X } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import AppScreen from "@/components/ui/AppScreen";
import { useTheme } from "@/hooks/useTheme";
import { useUI } from "@/hooks/useUI";
import { hexToRgba } from "@/libs/theme-utils";
import {
  copyText,
  getPaymentMethods,
  getPublishOptions,
  notifyPayment,
  pickProofDocuments,
} from "@/features/listings/publish-api";
import type { PaymentMethodsResponse, PublishOptionsResponse } from "@/types/marketplace";

const MAX_FILES = 3;
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];

type LocalProofFile = {
  uri: string;
  name: string;
  mimeType: string;
  size?: number;
};

export default function PaymentDetailsScreen() {
  const { id, code } = useLocalSearchParams<{ id: string; code?: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { showToast } = useUI();

  const [opts, setOpts] = useState<PublishOptionsResponse | null>(null);
  const [methods, setMethods] = useState<PaymentMethodsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshingAccount, setRefreshingAccount] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  const [proofFiles, setProofFiles] = useState<LocalProofFile[]>([]);

  const bank = useMemo(() => opts?.bankDetails || null, [opts]);
  const paymentCode = code || opts?.activePayment?.paymentCode || "";
  const price = opts?.price ?? 0;
  const existingProofs = opts?.activePayment?.proofAttachments || [];
  const isRejectedPaymentFlow =
    opts?.publishStatus === "REJECTED" && opts?.rejectionType === "PAYMENT";

  const load = async (silent = false) => {
    try {
      if (silent) {
        setRefreshingAccount(true);
      } else {
        setLoading(true);
      }

      const [optsRes, methodsRes] = await Promise.all([
        getPublishOptions(String(id)),
        getPaymentMethods(),
      ]);

      setOpts(optsRes);
      setMethods(methodsRes);
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Failed to load payment details",
        "error"
      );
    } finally {
      setLoading(false);
      setRefreshingAccount(false);
    }
  };

  useEffect(() => {
    if (id) load();
  }, [id]);

  useEffect(() => {
    const activePayment = opts?.activePayment;

    if (!activePayment?.accountExpiresAt || !activePayment.isAccountActive) {
      setTimeLeft(activePayment?.status === "EXPIRED" ? "Expired" : "");
      return;
    }

    const interval = setInterval(() => {
      const end = new Date(activePayment.accountExpiresAt).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);

        setTimeout(() => {
          load(true);
        }, 1200);

        return;
      }

      const mins = Math.floor(diff / 1000 / 60);
      const secs = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${mins}:${secs.toString().padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [opts?.activePayment?.accountExpiresAt, opts?.activePayment?.isAccountActive]);

  const onCopy = async (value: string) => {
    try {
      await copyText(value);
      showToast("Copied!", "success");
    } catch {
      showToast("Copy failed. Please copy manually.", "error");
    }
  };

  const appendFiles = (files: LocalProofFile[]) => {
    const next = [...proofFiles];

    for (const file of files) {
      if (next.length >= MAX_FILES) {
        showToast(`You can upload a maximum of ${MAX_FILES} files.`, "error");
        break;
      }

      if (!ALLOWED_TYPES.includes(file.mimeType)) {
        showToast("Only JPG, JPEG, PNG, WEBP images or PDF files are allowed.", "error");
        continue;
      }

      if (file.size && file.size > MAX_FILE_SIZE) {
        showToast("Each file must be 8MB or less.", "error");
        continue;
      }

      next.push(file);
    }

    setProofFiles(next);
  };

  const pickCameraImage = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        showToast("Camera permission is required", "error");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.9,
      });

      if (result.canceled) return;

      appendFiles(
        result.assets.map((asset, index) => ({
          uri: asset.uri,
          name: asset.fileName || `photo-${Date.now()}-${index}.jpg`,
          mimeType: asset.mimeType || "image/jpeg",
          size: asset.fileSize,
        }))
      );
    } catch {
      showToast("Failed to open camera", "error");
    }
  };

  const pickDocuments = async () => {
    try {
      const docs = await pickProofDocuments();
      appendFiles(docs);
    } catch {
      showToast("Failed to pick files", "error");
    }
  };

  const removeProofFile = (index: number) => {
    setProofFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onNotify = async () => {
    try {
      if (!opts) return;

      if (opts.publishPlan !== "PAID_30_DAYS") {
        showToast("This listing is not set to paid publishing.", "error");
        return;
      }

      if (!["DRAFT", "REJECTED", "EXPIRED"].includes(String(opts.publishStatus))) {
        showToast(`You can't submit payment while listing is ${opts.publishStatus}`, "error");
        return;
      }

      setSubmitting(true);

      await notifyPayment({
        listingId: String(id),
        reference,
        note,
        proofFiles: isRejectedPaymentFlow ? proofFiles : [],
      });

      showToast("Submitted! Waiting for admin confirmation.", "success");
      router.replace("/pending" as any);
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Failed to submit payment",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit =
    !!opts &&
    opts.publishPlan === "PAID_30_DAYS" &&
    ["DRAFT", "REJECTED", "EXPIRED"].includes(String(opts.publishStatus)) &&
    !!opts.activePayment &&
    !!bank &&
    timeLeft !== "Expired";

  return (
    <AppScreen scroll padded>
      <View className="overflow-hidden rounded-[28px]" style={{ backgroundColor: colors.surface }}>
        <View
          className="px-5 py-5"
          style={{
            backgroundColor: colors.background,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Text className="text-center text-2xl font-semibold" style={{ color: colors.text }}>
            Payment Details
          </Text>
          <Text className="mt-2 text-center text-sm leading-6" style={{ color: colors.muted }}>
            Bank transfer is recommended. After you pay, click “I have made payment”.
          </Text>
        </View>

        {loading ? (
          <View className="items-center px-5 py-10">
            <ActivityIndicator color={colors.brand} />
            <Text className="mt-3 text-sm" style={{ color: colors.muted }}>
              Trade Smart, Live Better.
            </Text>
          </View>
        ) : (
          <ScrollView
            style={{ backgroundColor: colors.background }}
            contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
            showsVerticalScrollIndicator={false}
          >
            {opts?.publishStatus === "REJECTED" &&
            opts?.rejectionType === "PAYMENT" &&
            opts?.rejectionReason ? (
              <View
                className="mb-4 rounded-3xl border p-5"
                style={{
                  borderColor: hexToRgba(colors.danger, 0.25),
                  backgroundColor: hexToRgba(colors.danger, 0.08),
                }}
              >
                <Text className="text-sm font-semibold" style={{ color: colors.danger }}>
                  Payment rejection reason
                </Text>
                <Text className="mt-1 text-sm leading-6" style={{ color: colors.text }}>
                  {opts.rejectionReason}
                </Text>
              </View>
            ) : null}

            <View
              className="mb-4 rounded-3xl border p-5"
              style={{
                borderColor: hexToRgba(colors.success, 0.25),
                backgroundColor: hexToRgba(colors.success, 0.08),
              }}
            >
              <Text className="text-sm leading-6" style={{ color: colors.text }}>
                Your listing will go live immediately after payment is confirmed.
              </Text>
            </View>

            {refreshingAccount ? (
              <View
                className="mb-4 rounded-3xl border p-5"
                style={{
                  borderColor: hexToRgba(colors.brand, 0.25),
                  backgroundColor: hexToRgba(colors.brand, 0.08),
                }}
              >
                <Text className="text-sm" style={{ color: colors.text }}>
                  Previous payment account expired. Fetching a fresh payment account...
                </Text>
              </View>
            ) : null}

            <View
              className="mb-4 rounded-3xl border p-6"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <View className="flex-row items-start justify-between gap-4">
                <View className="flex-1">
                  <Text className="text-xs font-medium uppercase" style={{ color: colors.muted }}>
                    Amount to pay
                  </Text>
                  <Text className="mt-2 text-4xl font-bold" style={{ color: colors.text }}>
                    ₦{price.toLocaleString()}
                  </Text>
                  <Text className="mt-2 text-sm" style={{ color: colors.muted }}>
                    Method: {methods?.recommended || "BANK_TRANSFER"}
                  </Text>
                </View>

                <View
                  className="rounded-full px-3 py-1.5"
                  style={{ backgroundColor: hexToRgba(colors.brand, 0.12) }}
                >
                  <Text className="text-xs font-semibold" style={{ color: colors.brand }}>
                    {timeLeft || "Velora"}
                  </Text>
                </View>
              </View>
            </View>

            <View
              className="mb-4 rounded-3xl border p-5"
              style={{
                borderColor: hexToRgba(colors.brand, 0.25),
                backgroundColor: hexToRgba(colors.brand, 0.08),
              }}
            >
              <Text className="text-sm font-semibold" style={{ color: colors.text }}>
                Make payment within 30 minutes
              </Text>
              <Text className="mt-1 text-sm leading-6" style={{ color: colors.muted }}>
                Do not save this account for future use. This account expires in{" "}
                <Text style={{ color: colors.text }}>{timeLeft || "Loading"}</Text>.
              </Text>
            </View>

            <View
              className="mb-4 rounded-3xl border p-6"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-base font-semibold" style={{ color: colors.text }}>
                  Transfer Details
                </Text>

                <View
                  className="rounded-full px-3 py-1"
                  style={{ backgroundColor: colors.success }}
                >
                  <Text className="text-xs font-medium text-white">Bank Transfer</Text>
                </View>
              </View>

              {bank ? (
                <>
                  {[
                    { label: "Bank Name", value: bank.bankName },
                    { label: "Account Name", value: bank.accountName },
                    { label: "Account Number", value: bank.accountNumber },
                  ].map((item) => (
                    <View
                      key={item.label}
                      className="mb-3 flex-row items-center justify-between rounded-2xl px-4 py-4"
                      style={{ backgroundColor: colors.background }}
                    >
                      <View className="flex-1 pr-3">
                        <Text className="text-xs uppercase" style={{ color: colors.muted }}>
                          {item.label}
                        </Text>
                        <Text className="mt-1 font-semibold" style={{ color: colors.text }}>
                          {item.value}
                        </Text>
                      </View>

                      <Pressable
                        onPress={() => onCopy(item.value)}
                        className="rounded-xl px-3 py-2"
                        style={{
                          borderWidth: 1,
                          borderColor: colors.border,
                          backgroundColor: colors.surface,
                        }}
                      >
                        <Text className="text-xs font-medium" style={{ color: colors.text }}>
                          Copy
                        </Text>
                      </Pressable>
                    </View>
                  ))}

                  {paymentCode ? (
                    <View
                      className="rounded-2xl border border-dashed p-4"
                      style={{
                        borderColor: hexToRgba(colors.brand, 0.35),
                        backgroundColor: hexToRgba(colors.brand, 0.06),
                      }}
                    >
                      <Text className="text-xs uppercase" style={{ color: colors.brand }}>
                        Payment Code
                      </Text>
                      <View className="mt-2 flex-row items-center justify-between gap-3">
                        <Text
                          className="flex-1 text-base font-bold"
                          numberOfLines={2}
                          style={{ color: colors.text }}
                        >
                          {paymentCode}
                        </Text>

                        <Pressable
                          onPress={() => onCopy(paymentCode)}
                          className="rounded-xl px-3 py-2"
                          style={{
                            borderWidth: 1,
                            borderColor: colors.border,
                            backgroundColor: colors.surface,
                          }}
                        >
                          <Text className="text-xs font-medium" style={{ color: colors.text }}>
                            Copy
                          </Text>
                        </Pressable>
                      </View>

                      <Text className="mt-2 text-xs leading-5" style={{ color: colors.muted }}>
                        Put this in your bank transfer narration for fast payment verification.
                      </Text>
                    </View>
                  ) : null}
                </>
              ) : (
                <Text style={{ color: colors.muted }}>No bank details available yet.</Text>
              )}
            </View>

            <View
              className="rounded-3xl border p-6"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <Text className="text-sm font-medium" style={{ color: colors.text }}>
                Transfer reference optional
              </Text>
              <TextInput
                value={reference}
                onChangeText={setReference}
                placeholder="e.g. bank narration / transaction ref"
                placeholderTextColor={colors.muted}
                style={{
                  marginTop: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  color: colors.text,
                  backgroundColor: colors.surface,
                }}
              />

              <Text className="mt-5 text-sm font-medium" style={{ color: colors.text }}>
                Note optional
              </Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Any extra info for admin"
                placeholderTextColor={colors.muted}
                style={{
                  marginTop: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  color: colors.text,
                  backgroundColor: colors.surface,
                }}
              />

              {isRejectedPaymentFlow ? (
                <View className="mt-5">
                  <Text className="text-sm font-medium" style={{ color: colors.text }}>
                    Proof of payment optional
                  </Text>
                  <Text className="mt-1 text-xs leading-5" style={{ color: colors.muted }}>
                    Upload screenshot, receipt, bank statement crop, transfer slip or PDF.
                  </Text>

                  <Pressable
                    onPress={pickCameraImage}
                    className="mt-3 flex-row items-center justify-center rounded-2xl px-4 py-3.5"
                    style={{
                      borderWidth: 1,
                      borderColor: colors.border,
                      backgroundColor: colors.surface,
                    }}
                  >
                    <Camera size={18} color={colors.text} />
                    <Text className="ml-3 text-sm font-medium" style={{ color: colors.text }}>
                      Camera
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={pickDocuments}
                    className="mt-3 flex-row items-center justify-center rounded-2xl px-4 py-3.5"
                    style={{
                      borderWidth: 1,
                      borderColor: colors.border,
                      backgroundColor: colors.surface,
                    }}
                  >
                    <Paperclip size={18} color={colors.text} />
                    <Text className="ml-3 text-sm font-medium" style={{ color: colors.text }}>
                      Upload Files
                    </Text>
                  </Pressable>

                  {proofFiles.length > 0 ? (
                    <View className="mt-3">
                      {proofFiles.map((file, index) => {
                        const isPdf = file.mimeType === "application/pdf";

                        return (
                          <View
                            key={`${file.name}-${index}`}
                            className="mb-2 flex-row items-center justify-between rounded-2xl p-3"
                            style={{
                              borderWidth: 1,
                              borderColor: colors.border,
                              backgroundColor: colors.background,
                            }}
                          >
                            <View className="flex-1 flex-row items-center">
                              {isPdf ? (
                                <FileText size={18} color={colors.danger} />
                              ) : (
                                <Camera size={18} color={colors.brand} />
                              )}

                              <View className="ml-3 flex-1">
                                <Text numberOfLines={1} style={{ color: colors.text }}>
                                  {file.name}
                                </Text>
                                <Text className="text-xs" style={{ color: colors.muted }}>
                                  {file.mimeType}
                                </Text>
                              </View>
                            </View>

                            <Pressable onPress={() => removeProofFile(index)}>
                              <X size={18} color={colors.muted} />
                            </Pressable>
                          </View>
                        );
                      })}
                    </View>
                  ) : null}

                  {existingProofs.length > 0 ? (
                    <View
                      className="mt-3 rounded-2xl p-4"
                      style={{
                        borderWidth: 1,
                        borderColor: hexToRgba(colors.brand, 0.22),
                        backgroundColor: hexToRgba(colors.brand, 0.06),
                      }}
                    >
                      <Text className="text-sm font-medium" style={{ color: colors.text }}>
                        Existing uploaded proof
                      </Text>

                      <View className="mt-3">
                        {existingProofs.map((item, index) => {
                          const isPdf =
                            item.resource_type === "raw" ||
                            item.url?.toLowerCase().includes(".pdf");

                          return (
                            <Pressable
                              key={`${item.public_id}-${index}`}
                              onPress={() => Linking.openURL(item.url)}
                              className="mb-2 flex-row items-center rounded-2xl p-3"
                              style={{
                                borderWidth: 1,
                                borderColor: colors.border,
                                backgroundColor: colors.surface,
                              }}
                            >
                              {isPdf ? (
                                <FileText size={18} color={colors.danger} />
                              ) : (
                                <Camera size={18} color={colors.brand} />
                              )}

                              <View className="ml-3 flex-1">
                                <Text numberOfLines={1} style={{ color: colors.text }}>
                                  {item.originalName || `Proof ${index + 1}`}
                                </Text>
                                <Text className="text-xs" style={{ color: colors.muted }}>
                                  Tap to open
                                </Text>
                              </View>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                  ) : null}
                </View>
              ) : null}

              <Pressable
                disabled={submitting || !canSubmit}
                onPress={onNotify}
                className="mt-6 items-center rounded-2xl px-4 py-3.5"
                style={{
                  backgroundColor:
                    submitting || !canSubmit
                      ? hexToRgba(colors.brand, 0.45)
                      : colors.brand,
                }}
              >
                <Text className="text-sm font-semibold text-white">
                  {submitting ? "Submitting..." : "I have made payment"}
                </Text>
              </Pressable>

              {!isRejectedPaymentFlow ? (
                <Pressable
                  onPress={() => router.push(`/listing-actions/${id}/payment` as any)}
                  className="mt-3 items-center rounded-2xl px-4 py-3.5"
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                  }}
                >
                  <Text className="text-sm font-medium" style={{ color: colors.text }}>
                    Back to plan selection
                  </Text>
                </Pressable>
              ) : null}
            </View>
          </ScrollView>
        )}
      </View>
    </AppScreen>
  );
}