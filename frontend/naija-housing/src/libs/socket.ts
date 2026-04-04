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
  });

  return socket;
};

export const connectSocket = () => {
  const instance = getSocket();

  if (!instance.connected) {
    instance.connect();

    instance.off("connect_error");

    instance.on("connect_error", (error) => {
      if (error?.message === "ACCOUNT_BANNED") {
        alert(
          "Your account has been banned for violating marketplace/community standards."
        );

        localStorage.removeItem("user");
        instance.disconnect();
        window.location.href = "/login";
        return;
      }

      console.error("Socket connection error:", error?.message || error);
    });
  }

  return instance;
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};