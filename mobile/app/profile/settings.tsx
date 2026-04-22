import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "@/hooks/useTheme";
import { useUI } from "@/hooks/useUI";
import {
  BadgeHelp,
  CalendarDays,
  CircleUserRound,
  Info,
  Palette,
  MapPin,
  Phone,
  Shield,
  User,
} from "lucide-react-native";

import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
import AppScreen from "@/components/ui/AppScreen";
import { changePassword, updateProfile } from "@/features/profile/api";
import {
  changePasswordSchema,
  profileUpdateSchema,
  type ChangePasswordSchemaType,
  type ProfileUpdateSchemaType,
} from "@/features/profile/schemas";
import { useAuthStore } from "@/store/auth-store";

const GENDER_OPTIONS = ["Male", "Female", "Other"];

function formatDobInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

function normalizeDobForSubmit(value?: string) {
  if (!value) return "";
  return formatDobInput(value.trim());
}

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const { showConfirm, showToast } = useUI();

  const defaultValues = useMemo<ProfileUpdateSchemaType>(
    () => ({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      location: user?.location ?? "",
      phone: user?.phone ?? "",
      dob: user?.dob ? new Date(user.dob).toISOString().slice(0, 10) : "",
      sex: user?.sex ?? "",
      bio: user?.bio ?? "",
    }),
    [user]
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileUpdateSchemaType>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues,
    values: defaultValues,
  });

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const { mode, setMode, colors, resolvedTheme } = useTheme();
  const selectedGender = watch("sex");

  const onSubmit = async (values: ProfileUpdateSchemaType) => {
    try {
      setSaving(true);

      const response = await updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        location: values.location || "",
        phone: values.phone || "",
        dob: normalizeDobForSubmit(values.dob),
        sex: values.sex || "",
        bio: values.bio || "",
      });

      setUser(response.user);

      showToast(response.message || "Profile updated successfully", "success");
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || error?.message || "Failed to update profile.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const onSubmitPassword = async (values: ChangePasswordSchemaType) => {
    try {
      setChangingPassword(true);

      const response = await changePassword(values);

      showToast(response.message || "Password changed successfully", "success");

      resetPasswordForm();
      setShowPasswordForm(false);
    } catch (error: any) {
      showToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to change password.",
        "error"
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const handleTogglePasswordForm = () => {
    if (showPasswordForm) {
      resetPasswordForm();
      setShowPasswordForm(false);
      return;
    }

    setShowPasswordForm(true);
  };

  const handleLogout = () => {
    showConfirm(
      {
        title: "Logout",
        message: "Logging out will end your current session on this device.",
        confirmText: "Logout",
        cancelText: "Cancel",
        confirmVariant: "danger",
      },
      async () => {
        try {
          await logout();
          router.replace("/" as any);
        } catch (error: any) {
          showToast(
            error?.response?.data?.message ||
              error?.message ||
              "Failed to logout.",
            "error"
          );
        }
      }
    );
  };

  return (
    <AppScreen padded={false}>
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 10, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="rounded-[28px] px-4 py-5"
          style={{ backgroundColor: colors.brand }}
        >
          <View className="flex-row items-start">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white/15">
              <CircleUserRound size={20} color="#FFFFFF" />
            </View>

            <View className="flex-1">
              <Text className="text-[24px] font-bold text-white">
                Update Profile
              </Text>
              <Text className="mt-1 text-[13px] leading-5 text-white/85">
                Manage your personal information, account security, appearance,
                and support options from one place.
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-5">
          <View
            className="rounded-[24px] border p-4"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <Text
              className="text-[18px] font-semibold"
              style={{ color: colors.text }}
            >
              Personal Information
            </Text>
            <Text className="mt-1 text-[13px]" style={{ color: colors.muted }}>
              Update your basic details so your profile stays accurate.
            </Text>

            <View className="mt-5">
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    label="First Name"
                    placeholder="Enter first name"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.firstName?.message}
                    leftIcon={<User size={16} color={colors.muted} />}
                  />
                )}
              />

              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    label="Last Name"
                    placeholder="Enter last name"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.lastName?.message}
                    leftIcon={<User size={16} color={colors.muted} />}
                  />
                )}
              />

              <Controller
                control={control}
                name="location"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    label="Location"
                    placeholder="Enter your location"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.location?.message}
                    leftIcon={<MapPin size={16} color={colors.muted} />}
                  />
                )}
              />

              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    label="Phone"
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.phone?.message}
                    leftIcon={<Phone size={16} color={colors.muted} />}
                  />
                )}
              />

              <Controller
                control={control}
                name="dob"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    label="Date of Birth"
                    placeholder="YYYY-MM-DD"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(formatDobInput(text))}
                    error={errors.dob?.message}
                    keyboardType="number-pad"
                    maxLength={10}
                    leftIcon={<CalendarDays size={16} color={colors.muted} />}
                  />
                )}
              />

              <View className="mb-4">
                <Text
                  className="mb-2 text-[14px] font-medium"
                  style={{ color: colors.text }}
                >
                  Gender
                </Text>

                <View className="flex-row flex-wrap gap-2">
                  {GENDER_OPTIONS.map((option) => {
                    const active = selectedGender === option;

                    return (
                      <Pressable
                        key={option}
                        onPress={() => setValue("sex", option, { shouldDirty: true })}
                        className="rounded-full border px-4 py-2"
                        style={{
                          borderColor: active ? colors.brand : colors.border,
                          backgroundColor: active ? colors.brand : colors.surface,
                        }}
                      >
                        <Text
                          className="text-[13px] font-medium"
                          style={{ color: active ? "#FFFFFF" : colors.text }}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                {errors.sex?.message ? (
                  <Text className="mt-2 text-sm" style={{ color: colors.danger }}>
                    {errors.sex.message}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>

          <View
            className="mt-5 rounded-[24px] border p-4"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <Text
              className="text-[18px] font-semibold"
              style={{ color: colors.text }}
            >
              About You
            </Text>
            <Text className="mt-1 text-[13px]" style={{ color: colors.muted }}>
              Add a short bio so people can know more about you.
            </Text>

            <View className="mt-5">
              <Controller
                control={control}
                name="bio"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    label="Bio"
                    placeholder="Write a short bio..."
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.bio?.message}
                    leftIcon={<Info size={16} color={colors.muted} />}
                    multiline
                    numberOfLines={6}
                    inputClassName="min-h-[140px] items-start py-4"
                    textAlignVertical="top"
                  />
                )}
              />
            </View>
          </View>

          <AppButton
            label="Save Changes"
            loading={saving}
            disabled={!isDirty && !saving}
            onPress={handleSubmit(onSubmit)}
            className="mt-5 h-12 rounded-2xl"
            textClassName="text-[15px] font-semibold text-white"
          />

          <View
            className="mt-5 rounded-[24px] border p-4"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <View className="flex-row items-start">
              <Shield size={18} color={colors.muted} style={{ marginTop: 2 }} />
              <View className="ml-3 flex-1">
                <Text
                  className="text-[18px] font-semibold"
                  style={{ color: colors.text }}
                >
                  Security
                </Text>
                <Text className="mt-1 text-[13px]" style={{ color: colors.muted }}>
                  Update your password to keep your account secure.
                </Text>
              </View>
            </View>

            <Pressable
              onPress={handleTogglePasswordForm}
              className="mt-4 h-12 items-center justify-center rounded-2xl border"
              style={{
                borderColor: colors.border,
                backgroundColor:
                  resolvedTheme === "dark" ? colors.surface : "#F9FAFB",
              }}
            >
              <Text
                className="text-[15px] font-semibold"
                style={{ color: colors.text }}
              >
                {showPasswordForm ? "Cancel" : "Change Password"}
              </Text>
            </Pressable>

            {showPasswordForm ? (
              <View className="mt-4">
                <Controller
                  control={passwordControl}
                  name="currentPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppInput
                      placeholder="Current password"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={passwordErrors.currentPassword?.message}
                      isPassword
                    />
                  )}
                />

                <Controller
                  control={passwordControl}
                  name="newPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppInput
                      placeholder="New password"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={passwordErrors.newPassword?.message}
                      isPassword
                    />
                  )}
                />

                <Text
                  className="mb-4 text-[13px] leading-5"
                  style={{ color: colors.muted }}
                >
                  Password must be at least 8 characters long and include one
                  uppercase letter, one lowercase letter, one number, and one
                  special character.
                </Text>

                <Controller
                  control={passwordControl}
                  name="confirmNewPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppInput
                      placeholder="Confirm new password"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={passwordErrors.confirmNewPassword?.message}
                      isPassword
                    />
                  )}
                />

                <AppButton
                  label="Submit"
                  loading={changingPassword}
                  onPress={handlePasswordSubmit(onSubmitPassword)}
                  className="mt-2 h-12 rounded-2xl bg-black"
                  textClassName="text-[15px] font-semibold text-white"
                />
              </View>
            ) : null}
          </View>

          <View
            className="mt-5 rounded-[24px] border p-4"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <View className="flex-row items-start">
              <BadgeHelp size={18} color={colors.muted} style={{ marginTop: 2 }} />
              <View className="ml-3 flex-1">
                <Text
                  className="text-[16px] font-semibold"
                  style={{ color: colors.text }}
                >
                  Help Center
                </Text>
                <Text className="mt-1 text-[13px]" style={{ color: colors.muted }}>
                  Read FAQs, terms, privacy policy, refund policy, and other important pages.
                </Text>
              </View>
            </View>

            <AppButton
              label="Open Help Center"
              onPress={() => router.push("/help" as any)}
              className="mt-4 h-12 rounded-2xl"
              textClassName="text-[15px] font-semibold text-white"
            />
          </View>

          <View
            className="mt-5 rounded-[24px] border p-4"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <View className="flex-row items-start">
              <Palette size={18} color={colors.muted} style={{ marginTop: 2 }} />
              <View className="ml-3 flex-1">
                <Text
                  className="text-[16px] font-semibold"
                  style={{ color: colors.text }}
                >
                  Appearance
                </Text>
                <Text className="mt-1 text-[13px]" style={{ color: colors.muted }}>
                  Switch your theme to the mode you prefer while using Velora.
                </Text>
              </View>
            </View>

            <View
              className="mt-4 rounded-2xl border p-2"
              style={{
                borderColor: colors.border,
                backgroundColor:
                  resolvedTheme === "dark" ? colors.surface : "#FCFCFD",
              }}
            >
              <View className="flex-row gap-2">
                {(["light", "dark", "system"] as const).map((item) => {
                  const active = mode === item;

                  return (
                    <Pressable
                      key={item}
                      onPress={() => setMode(item)}
                      className="flex-1 items-center rounded-xl px-3 py-3"
                      style={{
                        backgroundColor: active ? colors.brand : "transparent",
                      }}
                    >
                      <Text
                        className="text-[14px] font-medium capitalize"
                        style={{ color: active ? "#FFFFFF" : colors.text }}
                      >
                        {item === "system" ? "Auto" : item}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

          <View
            className="mt-5 rounded-[24px] border p-4"
            style={{
              borderColor: resolvedTheme === "dark" ? colors.border : "#FECACA",
              backgroundColor: resolvedTheme === "dark" ? colors.surface : "#FFF5F5",
            }}
          >
            <Text
              className="text-[18px] font-semibold"
              style={{ color: colors.danger }}
            >
              Account Actions
            </Text>
            <Text className="mt-1 text-[13px]" style={{ color: colors.danger }}>
              Logging out will end your current session on this device.
            </Text>

            <AppButton
              label="Logout"
              variant="danger"
              onPress={handleLogout}
              className="mt-4 h-12 rounded-2xl bg-[#EF4444]"
              textClassName="text-[15px] font-semibold text-white"
            />
          </View>
        </View>
      </ScrollView>
    </AppScreen>
  );
}