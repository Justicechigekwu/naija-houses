"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import adminApi from "@/libs/adminApi";

interface Admin {
  id: string;
  email: string;
  createdAt?: string;
}

interface AdminAuthContextProps {
  admin: Admin | null;
  isHydrated: boolean;
  adminLogin: (adminData: Admin) => void;
  adminLogout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextProps | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const authRequestVersion = useRef(0);

  useEffect(() => {
    let active = true;
    const requestVersion = ++authRequestVersion.current;

    const loadAdmin = async () => {
      try {
        const res = await adminApi.get("/admin/auth/me");

        if (!active || requestVersion !== authRequestVersion.current) return;

        setAdmin(res.data.admin);
      } catch {
        if (!active || requestVersion !== authRequestVersion.current) return;

        setAdmin(null);
      } finally {
        if (!active || requestVersion !== authRequestVersion.current) return;

        setIsHydrated(true);
      }
    };

    loadAdmin();

    return () => {
      active = false;
    };
  }, []);

  const adminLogin = (adminData: Admin) => {
    authRequestVersion.current += 1;
    setAdmin(adminData);
    setIsHydrated(true);
  };

  const adminLogout = async () => {
    try {
      await adminApi.post("/admin/auth/logout");
    } catch (error) {
      console.error("Admin logout error:", error);
    } finally {
      authRequestVersion.current += 1;
      setAdmin(null);
      setIsHydrated(true);
      window.location.href = "/admin/login";
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{ admin, isHydrated, adminLogin, adminLogout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
};