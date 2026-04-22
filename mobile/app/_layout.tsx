// import "../global.css";

// import { useEffect } from "react";
// import { Stack, useRouter, useSegments } from "expo-router";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { QueryClientProvider } from "@tanstack/react-query";
// import { StatusBar } from "expo-status-bar";
// import { Appearance } from "react-native";
// import { useFonts } from "expo-font";
// import {
//   Inter_400Regular,
//   Inter_500Medium,
//   Inter_600SemiBold,
//   Inter_700Bold,
// } from "@expo-google-fonts/inter";

// import { NotificationProvider } from "@/context/NotificationContext";
// import { queryClient } from "@/libs/queryClient";
// import { useAuthStore } from "@/store/auth-store";
// import { useThemeStore } from "@/store/theme-store";
// import LoadingScreen from "@/components/ui/LoadingScreen";
// import { UIProvider } from "@/context/UIContext";
// import { applyGlobalFont } from "@/libs/applyGlobalFont";
// import { BrowsingLocationProvider } from "@/context/BrowsingLocationContext";
// import usePushNotifications from "@/hooks/usePushNotifications";

// function RootNavigator() {
//   const router = useRouter();
//   const segments = useSegments();

//   const restoreTheme = useThemeStore((state) => state.restoreTheme);
//   const updateResolvedTheme = useThemeStore((state) => state.updateResolvedTheme);
//   const themeHydrated = useThemeStore((state) => state.hydrated);

//   const hydrated = useAuthStore((state) => state.hydrated);
//   const status = useAuthStore((state) => state.status);
//   const restoreSession = useAuthStore((state) => state.restoreSession);

//   usePushNotifications();

//   useEffect(() => {
//     restoreTheme();
//   }, [restoreTheme]);

//   useEffect(() => {
//     const subscription = Appearance.addChangeListener(() => {
//       updateResolvedTheme();
//     });

//     return () => subscription.remove();
//   }, [updateResolvedTheme]);

//   useEffect(() => {
//     restoreSession();
//   }, [restoreSession]);

//   useEffect(() => {
//     if (!hydrated) return;

//     const inAuthGroup = segments[0] === "(auth)";
//     const isAuthenticated = status === "authenticated";

//     if (isAuthenticated && inAuthGroup) {
//       router.replace("/(tabs)");
//     }
//   }, [hydrated, segments, status, router]);

//   if (!hydrated || !themeHydrated) {
//     return <LoadingScreen />;
//   }

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="(auth)" />
//       <Stack.Screen name="(tabs)" />
//       <Stack.Screen name="profile/settings" />
//       <Stack.Screen name="notification" />
//       <Stack.Screen name="drafts" />
//       <Stack.Screen name="pending" />
//       <Stack.Screen name="expired" />
//       <Stack.Screen name="feedback/index" />
//       <Stack.Screen name="listing-actions/[id]/payment" />
//       <Stack.Screen name="listing-actions/[id]/payment-details" />
//       <Stack.Screen name="listing-actions/[id]/rejected-payment" />
//       <Stack.Screen name="listing-actions/[id]/appeal" />
//     </Stack>
//   );
// }

// export default function RootLayout() {
//   const resolvedTheme = useThemeStore((state) => state.resolvedTheme);

//   const [fontsLoaded] = useFonts({
//     Inter_400Regular,
//     Inter_500Medium,
//     Inter_600SemiBold,
//     Inter_700Bold,
//   });

//   useEffect(() => {
//     if (fontsLoaded) {
//       applyGlobalFont();
//     }
//   }, [fontsLoaded]);

//   if (!fontsLoaded) {
//     return <LoadingScreen />;
//   }

//   return (
//     <NotificationProvider>
//       <GestureHandlerRootView style={{ flex: 1 }}>
//         <QueryClientProvider client={queryClient}>
//           <BrowsingLocationProvider>
//             <UIProvider>
//               <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
//               <RootNavigator />
//             </UIProvider>
//           </BrowsingLocationProvider>
//         </QueryClientProvider>
//       </GestureHandlerRootView>
//     </NotificationProvider>
//   );
// }


import "../global.css";

import { useEffect } from "react";
import { Appearance } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

import { NotificationProvider } from "@/context/NotificationContext";
import { queryClient } from "@/libs/queryClient";
import { useAuthStore } from "@/store/auth-store";
import { useThemeStore } from "@/store/theme-store";
import { UIProvider } from "@/context/UIContext";
import { applyGlobalFont } from "@/libs/applyGlobalFont";
import { BrowsingLocationProvider } from "@/context/BrowsingLocationContext";
import usePushNotifications from "@/hooks/usePushNotifications";

// Keep the native splash visible until we explicitly hide it.
SplashScreen.preventAutoHideAsync().catch(() => {
  // ignore if already prevented
});

// Optional native fade when hiding splash.
SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

function RootNavigator() {
  const router = useRouter();
  const segments = useSegments();

  const restoreTheme = useThemeStore((state) => state.restoreTheme);
  const updateResolvedTheme = useThemeStore((state) => state.updateResolvedTheme);
  const themeHydrated = useThemeStore((state) => state.hydrated);

  const hydrated = useAuthStore((state) => state.hydrated);
  const status = useAuthStore((state) => state.status);
  const restoreSession = useAuthStore((state) => state.restoreSession);

  usePushNotifications();

  useEffect(() => {
    restoreTheme();
  }, [restoreTheme]);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(() => {
      updateResolvedTheme();
    });

    return () => subscription.remove();
  }, [updateResolvedTheme]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    if (!hydrated) return;

    const inAuthGroup = segments[0] === "(auth)";
    const isAuthenticated = status === "authenticated";

    if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [hydrated, segments, status, router]);

  if (!hydrated || !themeHydrated) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="profile/settings" />
      <Stack.Screen name="notification" />
      <Stack.Screen name="drafts" />
      <Stack.Screen name="pending" />
      <Stack.Screen name="expired" />
      <Stack.Screen name="feedback/index" />
      <Stack.Screen name="listing-actions/[id]/payment" />
      <Stack.Screen name="listing-actions/[id]/payment-details" />
      <Stack.Screen name="listing-actions/[id]/rejected-payment" />
      <Stack.Screen name="listing-actions/[id]/appeal" />
      <Stack.Screen name="help/index" />
      <Stack.Screen name="help/about" />
      <Stack.Screen name="help/terms" />
      <Stack.Screen name="help/privacy" />
      <Stack.Screen name="help/user-agreement" />
      <Stack.Screen name="help/community-guidelines" />
      <Stack.Screen name="help/prohibited-items" />
      <Stack.Screen name="help/appeal-policy" />
      <Stack.Screen name="help/cookie-policy" />
      <Stack.Screen name="help/refund-policy" />
      <Stack.Screen name="help/safety-tips" />
      <Stack.Screen name="help/contact" />
    </Stack>
  );
}

export default function RootLayout() {
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
  const themeHydrated = useThemeStore((state) => state.hydrated);
  const authHydrated = useAuthStore((state) => state.hydrated);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      applyGlobalFont();
    }
  }, [fontsLoaded]);

  const appReady = fontsLoaded && themeHydrated && authHydrated;

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync().catch(() => {
        // ignore hide errors
      });
    }
  }, [appReady]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NotificationProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <BrowsingLocationProvider>
            <UIProvider>
              <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
              <RootNavigator />
            </UIProvider>
          </BrowsingLocationProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </NotificationProvider>
  );
}