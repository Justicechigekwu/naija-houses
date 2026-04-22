
export type AppColors = {
  brand: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
  danger: string;
  success: string;
};

export const lightColors: AppColors = {
  brand: "#9C7A5B",
  background: "#F5F5F5",
  surface: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  border: "#E5E7EB",
  danger: "#EF4444",
  success: "#16A34A",
};

export const darkColors: AppColors = {
  brand: "#9C7A5B",
  background: "#0F1115",
  surface: "#181C23",
  text: "#F3F4F6",
  muted: "#9CA3AF",
  border: "#2A303C",
  danger: "#EF4444",
  success: "#16A34A",
};

export type ThemeMode = "light" | "dark" | "system";