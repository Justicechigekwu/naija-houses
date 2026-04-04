// "use client";

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   ReactNode,
// } from "react";

// type Theme = "light" | "dark";

// type ThemeContextType = {
//   theme: Theme;
//   toggleTheme: () => void;
//   setTheme: (theme: Theme) => void;
// };

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// export function ThemeProvider({ children }: { children: ReactNode }) {
//   const [theme, setThemeState] = useState<Theme>("light");

//   useEffect(() => {
//     const savedTheme = localStorage.getItem("velora-theme") as Theme | null;

//     if (savedTheme === "dark" || savedTheme === "light") {
//       setThemeState(savedTheme);
//       document.documentElement.classList.toggle("dark", savedTheme === "dark");
//     }
//   }, []);

//   const setTheme = (newTheme: Theme) => {
//     setThemeState(newTheme);
//     localStorage.setItem("velora-theme", newTheme);
//     document.documentElement.classList.toggle("dark", newTheme === "dark");
//   };

//   const toggleTheme = () => {
//     setTheme(theme === "light" ? "dark" : "light");
//   };

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

// export function useTheme() {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error("useTheme must be used inside ThemeProvider");
//   }
//   return context;
// }