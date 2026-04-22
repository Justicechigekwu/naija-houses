// import { Controller, useForm } from "react-hook-form";
// import { Pressable, Text, View } from "react-native";
// import { Link, useLocalSearchParams, useRouter } from "expo-router";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Lock, Mail, User } from "lucide-react-native";
// import { AntDesign } from "@expo/vector-icons";

// import AppButton from "@/components/ui/AppButton";
// import AppInput from "@/components/ui/AppInput";
// import AppScreen from "@/components/ui/AppScreen";
// import {
//   signupSchema,
//   type SignupSchemaType,
// } from "@/features/auth/schemas";
// import { useAuthStore } from "@/store/auth-store";
// import { mapGoogleSignInError } from "@/features/auth/google";

// export default function SignupScreen() {
//   const router = useRouter();
//   const signup = useAuthStore((state) => state.signup);
//   const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
//   const status = useAuthStore((state) => state.status);
//   const errorMessage = useAuthStore((state) => state.error);
//   const clearError = useAuthStore((state) => state.clearError);
//   const setError = useAuthStore((state) => state.setError);

//   const { redirect } = useLocalSearchParams<{ redirect?: string }>();
//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<SignupSchemaType>({
//     resolver: zodResolver(signupSchema),
//     defaultValues: {
//       firstName: "",
//       lastName: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   const onSubmit = async (values: SignupSchemaType) => {
//     clearError();
  
//     try {
//       await signup(values);
  
//       if (redirect && typeof redirect === "string") {
//         router.replace(redirect as any);
//         return;
//       }
  
//       router.replace("/(tabs)" as any);
//     } catch {}
//   };

//   const onGooglePress = async () => {
//     clearError();
  
//     try {
//       await loginWithGoogle();
  
//       if (redirect && typeof redirect === "string") {
//         router.replace(redirect as any);
//         return;
//       }
  
//       router.replace("/(tabs)" as any);
//     } catch (error) {
//       setError(mapGoogleSignInError(error));
//     }
//   };

//   return (
//     <AppScreen scroll padded={false}>
//       <View className="flex-1 bg-[#F5F5F5] px-4 py-6">
//         <View className="flex-1 justify-center">
//           <View className="rounded-[28px] border border-[#E7E2DD] bg-white px-4 py-6">
//             <View className="mb-6 self-start rounded-full bg-[#F4EEE8] px-3 py-2">
//               <Text className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[#8A715D]">
//                 Join Velora
//               </Text>
//             </View>

//             <Text className="text-[22px] font-bold text-[#1B2430]">
//               Create your account
//             </Text>

//             <Text className="mt-2 text-[14px] leading-5 text-[#667085]">
//               Sign up to start posting listings, managing chats, and growing on
//               Velora.
//             </Text>

//             <View className="mt-7">
//               <Controller
//                 control={control}
//                 name="firstName"
//                 render={({ field: { onChange, onBlur, value } }) => (
//                   <AppInput
//                     label="First Name"
//                     placeholder="First name"
//                     value={value}
//                     onBlur={onBlur}
//                     onChangeText={onChange}
//                     error={errors.firstName?.message}
//                     leftIcon={<User size={16} color="#98A2B3" />}
//                   />
//                 )}
//               />

//               <Controller
//                 control={control}
//                 name="lastName"
//                 render={({ field: { onChange, onBlur, value } }) => (
//                   <AppInput
//                     label="Last Name"
//                     placeholder="Last name"
//                     value={value}
//                     onBlur={onBlur}
//                     onChangeText={onChange}
//                     error={errors.lastName?.message}
//                     leftIcon={<User size={16} color="#98A2B3" />}
//                   />
//                 )}
//               />

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
//                     label="Confirm Password"
//                     placeholder="Confirm password"
//                     isPassword
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                     value={value}
//                     onBlur={onBlur}
//                     onChangeText={onChange}
//                     error={errors.confirmPassword?.message}
//                     leftIcon={<Lock size={16} color="#98A2B3" />}
//                   />
//                 )}
//               />
//             </View>

//             {errorMessage ? (
//               <Text className="mb-4 text-sm text-red-500">{errorMessage}</Text>
//             ) : null}

//             <AppButton
//               label="Create Account"
//               loading={status === "loading"}
//               onPress={handleSubmit(onSubmit)}
//               className="mt-2 h-12 rounded-2xl bg-[#8A715D]"
//               textClassName="text-[15px] font-semibold text-white"
//             />

//             <View className="my-6 flex-row items-center">
//               <View className="h-[1px] flex-1 bg-[#E4E7EC]" />
//               <Text className="mx-3 text-[13px] text-[#98A2B3]">
//                 or continue with
//               </Text>
//               <View className="h-[1px] flex-1 bg-[#E4E7EC]" />
//             </View>

//             <Pressable
//               onPress={onGooglePress}
//               disabled={status === "loading"}
//               className={`h-12 flex-row items-center justify-center rounded-2xl border border-[#E4E7EC] bg-white px-4 ${
//                 status === "loading" ? "opacity-60" : ""
//               }`}
//             >
//               <AntDesign name="google" size={18} color="#344054" />
//               <Text className="ml-3 text-[14px] font-medium text-[#344054]">
//                 Continue with Google
//               </Text>
//             </Pressable>

//             <View className="mt-6 items-center">
//               <View className="flex-row items-center">
//                 <Text className="text-[14px] text-[#667085]">
//                   Already have an account?{" "}
//                 </Text>
//                 <Link
//                   href={
//                     redirect
//                       ? { pathname: "/login", params: { redirect } }
//                       : "/login"
//                   }
//                   asChild
//                 >
//                   <Pressable>
//                     <Text className="text-[14px] font-medium text-[#8A715D]">
//                       Login
//                     </Text>
//                   </Pressable>
//                 </Link>
//               </View>
//             </View>
//           </View>
//         </View>
//       </View>
//     </AppScreen>
//   );
// }




import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User } from "lucide-react-native";
import { AntDesign } from "@expo/vector-icons";

import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
import AppScreen from "@/components/ui/AppScreen";
import {
  signupSchema,
  type SignupSchemaType,
} from "@/features/auth/schemas";
import { useAuthStore } from "@/store/auth-store";
import { mapGoogleSignInError } from "@/features/auth/google";
import { useTheme } from "@/hooks/useTheme";

export default function SignupScreen() {
  const router = useRouter();
  const signup = useAuthStore((state) => state.signup);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const status = useAuthStore((state) => state.status);
  const errorMessage = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const setError = useAuthStore((state) => state.setError);

  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const { colors, resolvedTheme } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignupSchemaType) => {
    clearError();

    try {
      await signup(values);

      if (redirect && typeof redirect === "string") {
        router.replace(redirect as any);
        return;
      }

      router.replace("/(tabs)" as any);
    } catch {}
  };

  const onGooglePress = async () => {
    clearError();

    try {
      await loginWithGoogle();

      if (redirect && typeof redirect === "string") {
        router.replace(redirect as any);
        return;
      }

      router.replace("/(tabs)" as any);
    } catch (error) {
      setError(mapGoogleSignInError(error));
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
                Join Velora
              </Text>
            </View>

            <Text
              className="text-[22px] font-bold"
              style={{ color: colors.text }}
            >
              Create your account
            </Text>

            <Text
              className="mt-2 text-[14px] leading-5"
              style={{ color: colors.muted }}
            >
              Sign up to start posting listings, managing chats, and growing on
              Velora.
            </Text>

            <View className="mt-7">
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    label="First Name"
                    placeholder="First name"
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
                    placeholder="Last name"
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

            {errorMessage ? (
              <Text className="mb-4 text-sm" style={{ color: colors.danger }}>
                {errorMessage}
              </Text>
            ) : null}

            <AppButton
              label="Create account"
              loading={status === "loading"}
              onPress={handleSubmit(onSubmit)}
              className="mt-2 h-12 rounded-2xl"
              textClassName="text-[15px] font-semibold"
            />

            <View className="my-6 flex-row items-center">
              <View
                className="h-[1px] flex-1"
                style={{ backgroundColor: colors.border }}
              />
              <Text
                className="mx-3 text-[13px]"
                style={{ color: colors.muted }}
              >
                or continue with
              </Text>
              <View
                className="h-[1px] flex-1"
                style={{ backgroundColor: colors.border }}
              />
            </View>

            <Pressable
              onPress={onGooglePress}
              disabled={status === "loading"}
              className="h-12 flex-row items-center justify-center rounded-2xl px-4"
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.surface,
                opacity: status === "loading" ? 0.6 : 1,
              }}
            >
              <AntDesign name="google" size={18} color={colors.text} />
              <Text
                className="ml-3 text-[14px] font-medium"
                style={{ color: colors.text }}
              >
                Continue with Google
              </Text>
            </Pressable>

            <View className="mt-6 items-center">
              <View className="flex-row items-center">
                <Text className="text-[14px]" style={{ color: colors.muted }}>
                  Already have an account?{" "}
                </Text>
                <Link
                  href={
                    redirect
                      ? { pathname: "/login", params: { redirect } }
                      : "/login"
                  }
                  asChild
                >
                  <Pressable>
                    <Text
                      className="text-[14px] font-medium"
                      style={{ color: colors.brand }}
                    >
                      Login
                    </Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </View>
        </View>
      </View>
    </AppScreen>
  );
}