// import { Controller, useForm } from "react-hook-form";
// import { Pressable, Text, View } from "react-native";
// import { Link, useLocalSearchParams } from "expo-router";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Eye, Lock } from "lucide-react-native";
// import { useState } from "react";

// import AppButton from "@/components/ui/AppButton";
// import AppInput from "@/components/ui/AppInput";
// import AppScreen from "@/components/ui/AppScreen";
// import {
//   resetPasswordSchema,
//   type ResetPasswordSchemaType,
// } from "@/features/auth/schemas";
// import { resetPassword } from "@/features/auth/api";

// export default function ResetPasswordScreen() {
//   const { token } = useLocalSearchParams<{ token?: string }>();
//   const [serverMessage, setServerMessage] = useState("");
//   const [serverError, setServerError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<ResetPasswordSchemaType>({
//     resolver: zodResolver(resetPasswordSchema),
//     defaultValues: {
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   const onSubmit = async (values: ResetPasswordSchemaType) => {
//     setServerMessage("");
//     setServerError("");

//     if (!token || typeof token !== "string") {
//       setServerError("Reset token is missing.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await resetPassword(token, values);
//       setServerMessage(response.message);
//     } catch (error: any) {
//       setServerError(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Failed to reset password."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AppScreen scroll padded={false}>
//       <View className="flex-1 bg-[#F5F5F5] px-4 py-6">
//         <View className="flex-1 justify-center">
//           <View className="rounded-[28px] border border-[#E7E2DD] bg-white px-4 py-6">
//             <View className="mb-6 self-start rounded-full bg-[#F4EEE8] px-3 py-2">
//               <Text className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[#8A715D]">
//                 New Password
//               </Text>
//             </View>

//             <Text className="text-[22px] font-bold text-[#1B2430]">
//               Reset your password
//             </Text>

//             <Text className="mt-2 text-[14px] leading-5 text-[#667085]">
//               Enter your new password below.
//             </Text>

//             <View className="mt-7">
//               <Controller
//                 control={control}
//                 name="password"
//                 render={({ field: { onChange, onBlur, value } }) => (
//                   <AppInput
//                     label="Password"
//                     placeholder="Password"
//                     isPassword
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                     value={value}
//                     onBlur={onBlur}
//                     onChangeText={onChange}
//                     error={errors.password?.message}
//                     leftIcon={<Lock size={16} color="#98A2B3" />}
//                   />
//                 )}
//               />

//               <Controller
//                 control={control}
//                 name="confirmPassword"
//                 render={({ field: { onChange, onBlur, value } }) => (
//                   <AppInput
//                     label="Password"
//                     placeholder="Password"
//                     isPassword
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                     value={value}
//                     onBlur={onBlur}
//                     onChangeText={onChange}
//                     error={errors.password?.message}
//                     leftIcon={<Lock size={16} color="#98A2B3" />}
//                   />
//                 )}
//               />
//             </View>

//             {serverError ? (
//               <Text className="mb-4 text-sm text-red-500">{serverError}</Text>
//             ) : null}

//             {serverMessage ? (
//               <Text className="mb-4 text-sm text-green-600">
//                 {serverMessage}
//               </Text>
//             ) : null}

//             <AppButton
//               label="Update Password"
//               loading={loading}
//               onPress={handleSubmit(onSubmit)}
//               className="mt-2 h-12 rounded-2xl bg-[#8A715D]"
//               textClassName="text-[15px] font-semibold text-white"
//             />

//             <View className="mt-6 items-center">
//               <Link href="/login" asChild>
//                 <Pressable>
//                   <Text className="text-[14px] font-medium text-[#8A715D]">
//                     Back to login
//                   </Text>
//                 </Pressable>
//               </Link>
//             </View>
//           </View>
//         </View>
//       </View>
//     </AppScreen>
//   );
// }




import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react-native";
import { useState } from "react";

import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
import AppScreen from "@/components/ui/AppScreen";
import {
  resetPasswordSchema,
  type ResetPasswordSchemaType,
} from "@/features/auth/schemas";
import { resetPassword } from "@/features/auth/api";
import { useTheme } from "@/hooks/useTheme";

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [serverMessage, setServerMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const { colors, resolvedTheme } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordSchemaType) => {
    setServerMessage("");
    setServerError("");

    if (!token || typeof token !== "string") {
      setServerError("Reset token is missing.");
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword(token, values);
      setServerMessage(response.message);
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen scroll padded={false}>
      <View
        className="flex-1 px-4 py-6"
        style={{ backgroundColor: colors.background }}
      >
        <View className="flex-1 justify-center">
          <View
            className="rounded-[28px] px-4 py-6"
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View
              className="mb-6 self-start rounded-full px-3 py-2"
              style={{
                backgroundColor:
                  resolvedTheme === "dark" ? "rgba(156,122,91,0.18)" : "#F4EEE8",
              }}
            >
              <Text
                className="text-[11px] font-semibold uppercase tracking-[1.5px]"
                style={{ color: colors.brand }}
              >
                New Password
              </Text>
            </View>

            <Text
              className="text-[22px] font-bold"
              style={{ color: colors.text }}
            >
              Reset your password
            </Text>

            <Text
              className="mt-2 text-[14px] leading-5"
              style={{ color: colors.muted }}
            >
              Enter your new password below.
            </Text>

            <View className="mt-7">
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    label="Password"
                    placeholder="Password"
                    isPassword
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.password?.message}
                    leftIcon={<Lock size={16} color={colors.muted} />}
                  />
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    label="Confirm Password"
                    placeholder="Confirm password"
                    isPassword
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.confirmPassword?.message}
                    leftIcon={<Lock size={16} color={colors.muted} />}
                  />
                )}
              />
            </View>

            {serverError ? (
              <Text className="mb-4 text-sm" style={{ color: colors.danger }}>
                {serverError}
              </Text>
            ) : null}

            {serverMessage ? (
              <Text className="mb-4 text-sm" style={{ color: colors.success }}>
                {serverMessage}
              </Text>
            ) : null}

            <AppButton
              label="Reset Password"
              loading={loading}
              onPress={handleSubmit(onSubmit)}
              className="mt-2 h-12 rounded-2xl"
              textClassName="text-[15px] font-semibold"
            />

            <View className="mt-6 items-center">
              <Link href="/login" asChild>
                <Pressable>
                  <Text
                    className="text-[14px] font-medium"
                    style={{ color: colors.brand }}
                  >
                    Back to login
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </AppScreen>
  );
}