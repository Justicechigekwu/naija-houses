import { useThemeStore } from "@/store/theme-store";

export function useTheme() {
  const mode = useThemeStore((state) => state.mode);
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
  const colors = useThemeStore((state) => state.colors);
  const setMode = useThemeStore((state) => state.setMode);

  return {
    mode,
    resolvedTheme,
    colors,
    setMode,
  };
} 