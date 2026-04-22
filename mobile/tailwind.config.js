/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./libs/**/*.{js,jsx,ts,tsx}",
    "./store/**/*.{js,jsx,ts,tsx}",
    "./theme/**/*.{js,jsx,ts,tsx}",
    "./types/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#9C7A5B",
          50: "#F6F1EC",
          100: "#EADFD4",
          200: "#D8C4B1",
          300: "#C3A487",
          400: "#B28C6A",
          500: "#9C7A5B",
          600: "#87684C",
          700: "#6E543E",
          800: "#584433",
          900: "#48382B",
        },
        app: {
          bg: "#F7F7F8",
          surface: "#FFFFFF",
          muted: "#6B7280",
          border: "#E5E7EB",
          text: "#111827",
          danger: "#EF4444",
          success: "#16A34A",
        },
      },
    },
  },
  plugins: [],
};