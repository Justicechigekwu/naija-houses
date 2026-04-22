"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";
import adminApi, { setAdminSessionExpiredHandler } from "@/libs/adminApi";

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
  handleSessionExpired: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextProps | undefined>(
  undefined
);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const authRequestVersion = useRef(0);
  const hasHandledExpiryRef = useRef(false);
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/admin/login" || pathname === "/admin/register";

  const handleSessionExpired = useCallback(async () => {
    if (hasHandledExpiryRef.current) return;
    hasHandledExpiryRef.current = true;

    try {
      await adminApi.post("/admin/auth/logout");
    } catch {}

    setAdmin(null);
    setIsHydrated(true);

    if (typeof window !== "undefined") {
      sessionStorage.setItem("admin_session_expired", "1");

      if (
        window.location.pathname !== "/admin/login" &&
        window.location.pathname !== "/admin/register"
      ) {
        window.location.href = "/admin/login?expired=1";
      }
    }
  }, []);

  useEffect(() => {
    setAdminSessionExpiredHandler(() => {
      if (!isAuthPage) {
        handleSessionExpired();
      }
    });
  }, [handleSessionExpired, isAuthPage]);

  useEffect(() => {
    if (isAuthPage) {
      setAdmin(null);
      setIsHydrated(true);
      return;
    }

    let active = true;
    const requestVersion = ++authRequestVersion.current;

    const loadAdmin = async () => {
      try {
        const res = await adminApi.get("/admin/auth/me");

        if (!active || requestVersion !== authRequestVersion.current) return;

        hasHandledExpiryRef.current = false;
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
  }, [isAuthPage]);

  useEffect(() => {
    if (isAuthPage) return;

    const revalidateSession = async () => {
      if (!admin) return;

      try {
        const res = await adminApi.get("/admin/auth/me");
        hasHandledExpiryRef.current = false;
        setAdmin(res.data.admin);
      } catch {
        await handleSessionExpired();
      }
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        revalidateSession();
      }
    };

    const onFocus = () => {
      revalidateSession();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [admin, handleSessionExpired, isAuthPage]);

  const adminLogin = (adminData: Admin) => {
    authRequestVersion.current += 1;
    hasHandledExpiryRef.current = false;
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
      hasHandledExpiryRef.current = false;
      setAdmin(null);
      setIsHydrated(true);
      window.location.href = "/admin/login";
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isHydrated,
        adminLogin,
        adminLogout,
        handleSessionExpired,
      }}
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