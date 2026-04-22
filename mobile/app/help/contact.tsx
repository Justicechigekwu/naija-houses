import { useEffect, useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { Mail, MapPin, Phone, Send, User, FileText } from "lucide-react-native";

import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
import LegalPageScreen from "@/components/help/LegalPageScreen";
import LegalSectionMobile from "@/components/help/LegalSectionMobile";
import { LegalMutedText } from "@/components/help/LegalText";
import {
  createSupportMessage,
  type SupportMessagePayload,
} from "@/features/help/api";
import { useAuthStore } from "@/store/auth-store";
import { useTheme } from "@/hooks/useTheme";
import { useUI } from "@/hooks/useUI";
import { env } from "@/libs/env";

export default function ContactSupportScreen() {
  const { colors } = useTheme();
  const { showToast } = useUI();
  const user = useAuthStore((state) => state.user);

  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, reset } = useForm<SupportMessagePayload>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      reason: "",
      message: "",
    },
  });

  useEffect(() => {
    if (!user) return;

    reset({
      fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      email: user.email || "",
      phone: user.phone || "",
      address: user.location || "",
      reason: "",
      message: "",
    });
  }, [user, reset]);

  const onSubmit = async (values: SupportMessagePayload) => {
    try {
      setSubmitting(true);

      const response = await createSupportMessage({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone?.trim() || "",
        address: values.address?.trim() || "",
        reason: values.reason.trim(),
        message: values.message.trim(),
      });

      showToast(
        response.message || "Your support request has been sent successfully.",
        "success"
      );

      reset({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        reason: "",
        message: "",
      });
    } catch (error: any) {
      showToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to send support request.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const supportEmail = env.supportEmail;

  const handleEmailPress = async () => {
    const url = `mailto:${supportEmail}?subject=${encodeURIComponent(
      "Velora Support Request"
    )}`;

    try {
      await Linking.openURL(url);
    } catch (error: any) {
      showToast(
        error?.message || "Could not open your email app.",
        "error"
      );
    }
  };

  return (
    <LegalPageScreen
      title="Contact Velora Support"
      description="Need help with your account, listings, payments, reports, or appeals? Contact Velora support here."
    >
      <LegalSectionMobile title="1. Send a support form">
        <View
          className="rounded-[22px] border p-4"
          style={{
            borderColor: colors.border,
            backgroundColor: colors.surface,
          }}
        >
          <Controller
            control={control}
            name="fullName"
            rules={{ required: "Full name is required" }}
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <AppInput
                label="Full name"
                placeholder="Enter your full name"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={fieldState.error?.message}
                leftIcon={<User size={16} color={colors.muted} />}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            rules={{ required: "Email is required" }}
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <AppInput
                label="Email address"
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={fieldState.error?.message}
                leftIcon={<Mail size={16} color={colors.muted} />}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <AppInput
                label="Phone number"
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={fieldState.error?.message}
                leftIcon={<Phone size={16} color={colors.muted} />}
              />
            )}
          />

          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <AppInput
                label="Address"
                placeholder="Enter your address"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={fieldState.error?.message}
                leftIcon={<MapPin size={16} color={colors.muted} />}
              />
            )}
          />

          <Controller
            control={control}
            name="reason"
            rules={{ required: "Reason is required" }}
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <AppInput
                label="Reason"
                placeholder="Example: payment issue, account problem, listing issue"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={fieldState.error?.message}
                leftIcon={<FileText size={16} color={colors.muted} />}
              />
            )}
          />

          <Controller
            control={control}
            name="message"
            rules={{ required: "Message is required" }}
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <AppInput
                label="Message / Description"
                placeholder="Explain the problem clearly so support can help faster."
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={fieldState.error?.message}
                multiline
                numberOfLines={6}
                inputClassName="min-h-[140px] items-start py-4"
                textAlignVertical="top"
              />
            )}
          />

          <AppButton
            label={submitting ? "Sending..." : "Send support request"}
            onPress={handleSubmit(onSubmit)}
            loading={submitting}
            className="mt-2 h-12 rounded-2xl"
            textClassName="text-[15px] font-semibold text-white"
          />
        </View>
      </LegalSectionMobile>

      <LegalSectionMobile title="2. Contact us directly by email">
        <View
          className="rounded-[22px] border p-4"
          style={{
            borderColor: colors.border,
            backgroundColor: colors.surface,
          }}
        >
          <LegalMutedText>
            You can also contact Velora directly through your device email app.
          </LegalMutedText>

          <Pressable
            onPress={handleEmailPress}
            className="mt-4 flex-row items-center justify-center rounded-2xl border px-4 py-3"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.background,
            }}
          >
            <Mail size={16} color={colors.text} />
            <Text
              className="ml-2 text-[14px] font-medium"
              style={{ color: colors.text }}
            >
              {supportEmail}
            </Text>
          </Pressable>

          <View className="mt-3 flex-row items-center">
            <Send size={14} color={colors.muted} />
            <Text className="ml-2 text-[12px]" style={{ color: colors.muted }}>
              Tapping the email address opens your device mail app.
            </Text>
          </View>
        </View>
      </LegalSectionMobile>
    </LegalPageScreen>
  );
}