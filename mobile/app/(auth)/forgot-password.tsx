// import { Controller, useForm } from "react-hook-form";
// import { Pressable, Text, View } from "react-native";
// import { Link } from "expo-router";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Mail } from "lucide-react-native";
// import { useState } from "react";

// import AppButton from "@/components/ui/AppButton";
// import AppInput from "@/components/ui/AppInput";
// import AppScreen from "@/components/ui/AppScreen";
// import {
//   forgotPasswordSchema,
//   type ForgotPasswordSchemaType,
// } from "@/features/auth/schemas";
// import { forgotPassword } from "@/features/auth/api";

// export default function ForgotPasswordScreen() {
//   const [serverMessage, setServerMessage] = useState("");
//   const [serverError, setServerError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<ForgotPasswordSchemaType>({
//     resolver: zodResolver(forgotPasswordSchema),
//     defaultValues: {
//       email: "",
//     },
//   });

//   const onSubmit = async (values: ForgotPasswordSchemaType) => {
//     setServerMessage("");
//     setServerError("");
//     setLoading(true);

//     try {
//       const response = await forgotPassword(values);
//       setServerMessage(response.message);
//     } catch (error: any) {
//       setServerError(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Failed to send reset link."
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
//                 Password Help
//               </Text>
//             </View>

//             <Text className="text-[22px] font-bold text-[#1B2430]">
//               Forgot password?
//             </Text>

//             <Text className="mt-2 text-[14px] leading-5 text-[#667085]">
//               Enter your email address and we’ll send you a reset link.
//             </Text>

//             <View className="mt-7">
//               <Controller
//                 control={control}
//                 name="email"
//                 render={({ field: { onChange, onBlur, value } }) => (
//                   <AppInput
//                     label="Email Address"
//                     placeholder="Email"
//                     keyboardType="email-address"
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                     value={value}
//                     onBlur={onBlur}
//                     onChangeText={onChange}
//                     error={errors.email?.message}
//                     leftIcon={<Mail size={16} color="#98A2B3" />}
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
//               label="Send Reset Link"
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
import { Link } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react-native";
import { useState } from "react";

import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
import AppScreen from "@/components/ui/AppScreen";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchemaType,
} from "@/features/auth/schemas";
import { forgotPassword } from "@/features/auth/api";
import { useTheme } from "@/hooks/useTheme";

export default function ForgotPasswordScreen() {
  const [serverMessage, setServerMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const { colors, resolvedTheme } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordSchemaType) => {
    setServerMessage("");
    setServerError("");
    setLoading(true);

    try {
      const response = await forgotPassword(values);
      setServerMessage(response.message);
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to send reset link."
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
                Password Help
              </Text>
            </View>

            <Text
              className="text-[22px] font-bold"
              style={{ color: colors.text }}
            >
              Forgot password?
            </Text>

            <Text
              className="mt-2 text-[14px] leading-5"
              style={{ color: colors.muted }}
            >
              Enter your email address and we’ll send you a reset link.
            </Text>

            <View className="mt-7">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    label="Email Address"
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.email?.message}
                    leftIcon={<Mail size={16} color={colors.muted} />}
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
              label="Send Reset Link"
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