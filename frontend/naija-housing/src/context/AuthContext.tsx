// "use client";

// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
//   useRef,
// } from "react";
// import api from "@/libs/api";

// interface User {
//   id?: string;
//   _id?: string;
//   slug?: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   avatar?: string;
//   phone?: string;
//   location?: string;
//   bio?: string;
//   dob?: string;
//   sex?: string;
//   provider?: "local" | "google";
// }

// interface AuthContextProps {
//   user: User | null;
//   isHydrated: boolean;
//   login: (userData: User) => void;
//   updateUser: (userData: Partial<User>) => void;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isHydrated, setIsHydrated] = useState(false);
//   const authRequestVersion = useRef(0);

//   useEffect(() => {
//     let active = true;
//     const requestVersion = ++authRequestVersion.current;

//     const loadUser = async () => {
//       try {
//         const res = await api.get("/auth/me");

//         if (!active || requestVersion !== authRequestVersion.current) return;

//         setUser(res.data.user);
//         localStorage.setItem("user", JSON.stringify(res.data.user));
//       } catch {
//         if (!active || requestVersion !== authRequestVersion.current) return;

//         localStorage.removeItem("user");
//         setUser(null);
//       } finally {
//         if (!active || requestVersion !== authRequestVersion.current) return;
//         setIsHydrated(true);
//       }
//     };

//     loadUser();

//     return () => {
//       active = false;
//     };
//   }, []);

//   const login = (userData: User) => {
//     authRequestVersion.current += 1;
//     localStorage.setItem("user", JSON.stringify(userData));
//     setUser(userData);
//     setIsHydrated(true);
//   };

//   const updateUser = (userData: Partial<User>) => {
//     setUser((prev) => {
//       if (!prev) return prev;
//       const updated = { ...prev, ...userData };
//       localStorage.setItem("user", JSON.stringify(updated));
//       return updated;
//     });
//   };

//   const logout = async () => {
//     try {
//       await api.post("/auth/logout");
//     } catch (error) {
//       console.error("Logout error:", error);
//     } finally {
//       authRequestVersion.current += 1;
//       localStorage.removeItem("user");
//       setUser(null);
//       setIsHydrated(true);
//       window.location.href = "/login";
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, isHydrated, login, updateUser, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// };





"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import api from "@/libs/api";

interface User {
  id?: string;
  _id?: string;
  slug?: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  dob?: string;
  sex?: string;
  provider?: "local" | "google";
}

interface AuthContextProps {
  user: User | null;
  isHydrated: boolean;
  login: (userData: User) => void;
  updateUser: (userData: Partial<User>) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const authRequestVersion = useRef(0);

  useEffect(() => {
    let active = true;
    const requestVersion = ++authRequestVersion.current;

    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    setIsHydrated(true);

    const loadUser = async () => {
      try {
        const res = await api.get("/auth/me");

        if (!active || requestVersion !== authRequestVersion.current) return;

        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch {
        if (!active || requestVersion !== authRequestVersion.current) return;

        localStorage.removeItem("user");
        setUser(null);
      }
    };

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  const login = (userData: User) => {
    authRequestVersion.current += 1;
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsHydrated(true);
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...userData };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      authRequestVersion.current += 1;
      localStorage.removeItem("user");
      setUser(null);
      setIsHydrated(true);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, isHydrated, login, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};