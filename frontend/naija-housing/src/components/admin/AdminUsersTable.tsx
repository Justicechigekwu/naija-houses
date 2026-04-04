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

  const goToUser = (userId: string, filter = "all") => {
    router.push(`/admin/users/${userId}?filter=${filter}`);
  };

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
              onClick={() => goToUser(u.id)}
            >
              <td className="p-3">
                {u.firstName} {u.lastName}
              </td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="px-2 py-1 rounded bg-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToUser(u.id, "all");
                    }}
                  >
                    Total: {u.badges.total}
                  </button>

                  <button
                    type="button"
                    className="px-2 py-1 rounded bg-green-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToUser(u.id, "active");
                    }}
                  >
                    Active: {u.badges.active}
                  </button>

                  <button
                    type="button"
                    className="px-2 py-1 rounded bg-yellow-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToUser(u.id, "pending");
                    }}
                  >
                    Pending: {u.badges.pending}
                  </button>

                  <button
                    type="button"
                    className="px-2 py-1 rounded bg-blue-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToUser(u.id, "awaiting");
                    }}
                  >
                    Awaiting: {u.badges.awaitingPayment}
                  </button>

                  <span className="px-2 py-1 rounded bg-red-200">
                    Expired: {u.badges.expired}
                  </span>
                </div>
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