import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { Appearance } from "react-native";
import {
  darkColors,
  lightColors,
  type ThemeMode,
  type AppColors,
} from "@/theme/colors";

const THEME_MODE_KEY = "velora_theme_mode";

type ThemeStore = {
  mode: ThemeMode;
  hydrated: boolean;
  setMode: (mode: ThemeMode) => Promise<void>;
  restoreTheme: () => Promise<void>;
  resolvedTheme: "light" | "dark";
  colors: AppColors;
  updateResolvedTheme: () => void;
};

function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "light") return "light";
  if (mode === "dark") return "dark";

  return Appearance.getColorScheme() === "dark" ? "dark" : "light";
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  mode: "system",
  hydrated: false,
  resolvedTheme: resolveTheme("system"),
  colors: resolveTheme("system") === "dark" ? darkColors : lightColors,

  async setMode(mode) {
    const resolvedTheme = resolveTheme(mode);

    await SecureStore.setItemAsync(THEME_MODE_KEY, mode);

    set({
      mode,
      resolvedTheme,
      colors: resolvedTheme === "dark" ? darkColors : lightColors,
    });
  },

  async restoreTheme() {
    const saved = (await SecureStore.getItemAsync(
      THEME_MODE_KEY
    )) as ThemeMode | null;

    const mode: ThemeMode = saved || "system";
    const resolvedTheme = resolveTheme(mode);

    set({
      mode,
      resolvedTheme,
      colors: resolvedTheme === "dark" ? darkColors : lightColors,
      hydrated: true,
    });
  },

  updateResolvedTheme() {
    const mode = get().mode;
    const resolvedTheme = resolveTheme(mode);

    set({
      resolvedTheme,
      colors: resolvedTheme === "dark" ? darkColors : lightColors,
    });
  },
}));