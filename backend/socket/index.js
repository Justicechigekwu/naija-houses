// import { Server } from "socket.io";
// import { socketAuthMiddleware } from "./socketAuth.js";
// import { registerSocketEvents } from "./socketEvents.js";
// import { SOCKET_EVENTS } from "../utils/socketEventNames.js";

// let ioInstance = null;

// export const initSocket = (httpServer) => {
//   ioInstance = new Server(httpServer, {
//     cors: {
//       origin: process.env.CLIENT_URL || "http://localhost:3000",
//       credentials: true,
//       methods: ["GET", "POST", "PATCH", "DELETE"],
//     },
//     transports: ["websocket", "polling"],
//     pingTimeout: 20000,
//     pingInterval: 25000,
//   });

//   ioInstance.use(socketAuthMiddleware);

//   ioInstance.on("connection", (socket) => {
//     socket.join(`user:${socket.user.id}`);

//     socket.emit(SOCKET_EVENTS.CONNECTION_READY, {
//       ok: true,
//       userId: socket.user.id,
//     });

//     registerSocketEvents(ioInstance, socket);

//     socket.on("disconnect", (reason) => {
//       console.log(`Socket disconnected for user ${socket.user.id}: ${reason}`);
//     });
//   });

//   return ioInstance;
// };

// export const getIO = () => {
//   if (!ioInstance) {
//     throw new Error("Socket.IO has not been initialized");
//   }

//   return ioInstance;
// };



// socket/index.js

import { Server } from "socket.io";
import { socketAuthMiddleware } from "./socketAuth.js";
import { registerSocketEvents } from "./socketEvents.js";
import { SOCKET_EVENTS } from "../utils/socketEventNames.js";

let ioInstance = null;

export const initSocket = (httpServer) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST", "PATCH", "DELETE"],
    },
    transports: ["websocket", "polling"],
    pingTimeout: 20000,
    pingInterval: 25000,
  });

  ioInstance.use(socketAuthMiddleware);

  ioInstance.on("connection", (socket) => {
    socket.join(`user:${socket.user.id}`);

    if (socket.user.isAdmin) {
      socket.join("admin:payments");
    }

    socket.emit(SOCKET_EVENTS.CONNECTION_READY, {
      ok: true,
      userId: socket.user.id,
      isAdmin: socket.user.isAdmin,
    });

    registerSocketEvents(ioInstance, socket);

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected for user ${socket.user.id}: ${reason}`);
    });
  });

  return ioInstance;
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.IO has not been initialized");
  }

  return ioInstance;
};