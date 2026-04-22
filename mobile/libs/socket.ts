import { io, Socket } from "socket.io-client";
import { env } from "@/libs/env";
import { getAccessToken } from "@/libs/auth-storage";

let socket: Socket | null = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io(env.socketUrl, {
      transports: ["websocket", "polling"],
      autoConnect: false,
    });

    getAccessToken().then((token) => {
      if (socket && token) {
        socket.auth = { token };
        socket.connect();
      }
    });
  } else if (!socket.connected) {
    getAccessToken().then((token) => {
      if (socket && token) {
        socket.auth = { token };
        socket.connect();
      }
    });
  }

  return socket;
};