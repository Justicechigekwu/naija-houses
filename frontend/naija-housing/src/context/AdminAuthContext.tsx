"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface Admin {
  id: string;
  email: string;
}

interface AdminAuthContextProps {
  admin: Admin | null;
  adminToken: string | null;
  isHydrated: boolean;
  adminLogin: (adminData: Admin, token: string) => void;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextProps | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedAdmin = localStorage.getItem("admin");
      const storedToken = localStorage.getItem("adminToken");

      if (storedAdmin && storedToken) {
        setAdmin(JSON.parse(storedAdmin));
        setAdminToken(storedToken);
      }
    } catch (error) {
      console.error("Failed to restore admin auth:", error);
      localStorage.removeItem("admin");
      localStorage.removeItem("adminToken");
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const adminLogin = (adminData: Admin, token: string) => {
    localStorage.setItem("admin", JSON.stringify(adminData));
    localStorage.setItem("adminToken", token);
    setAdmin(adminData);
    setAdminToken(token);
  };

  const adminLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    setAdmin(null);
    setAdminToken(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{ admin, adminToken, isHydrated, adminLogin, adminLogout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
};