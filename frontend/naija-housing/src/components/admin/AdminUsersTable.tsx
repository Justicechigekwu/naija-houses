"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import adminApi from "@/libs/adminApi";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { AxiosError } from "axios";

type UserRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  badges: {
    total: number;
    active: number;
    pending: number;
    awaitingPayment: number;
    expired: number;
  };
};

export default function AdminUsersTable() {
  const router = useRouter();
  const { admin, isHydrated } = useAdminAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isHydrated) return;
    if (!admin) return;

    const load = async () => {
      try {
        setError("");
        const res = await adminApi.get("/admin/users");
        setUsers(res.data);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          setError(err.response?.data?.message || "Failed to load users");
        } else {
          setError("Failed to load users");
        }
      }
    };

    load();
  }, [admin, isHydrated]);

  return (
    <div className="bg-white border rounded overflow-hidden">
      {error && <p className="text-red-500 p-3">{error}</p>}

      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3">User</th>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Badges</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u.id}
              className="border-t hover:bg-gray-50 cursor-pointer"
              onClick={() => router.push(`/admin/users/${u.id}`)}
            >
              <td className="p-3">
                {u.firstName} {u.lastName}
              </td>
              <td className="p-3">{u.email}</td>
              <td className="p-3 flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded bg-gray-200">
                  Total: {u.badges.total}
                </span>
                <span className="px-2 py-1 rounded bg-green-200">
                  Active: {u.badges.active}
                </span>
                <span className="px-2 py-1 rounded bg-yellow-200">
                  Pending: {u.badges.pending}
                </span>
                <span className="px-2 py-1 rounded bg-blue-200">
                  Awaiting: {u.badges.awaitingPayment}
                </span>
                <span className="px-2 py-1 rounded bg-red-200">
                  Expired: {u.badges.expired}
                </span>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td className="p-3" colSpan={3}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}