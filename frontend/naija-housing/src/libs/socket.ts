"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (socket) return socket;

  const SOCKET_URL =
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

  socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ["websocket", "polling"],
    withCredentials: true,
    auth: {
      token:
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null,
    },
  });

  return socket;
};

export const connectSocket = () => {
  const socket = getSocket();

  if (!socket.connected) {
    socket.auth = {
      token:
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null,
    };

    socket.connect();

    socket.off("connect_error");

    socket.on("connect_error", (error) => {
      if (error?.message === "ACCOUNT_BANNED") {
        alert(
          "Your account has been banned for violating marketplace/community standards."
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        socket.disconnect();

        window.location.href = "/login";
      }
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};