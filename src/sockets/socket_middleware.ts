import { io } from "./index.ts";

export const socketMiddleware = (socket: any, next: any) => {
  const { token } = socket.handshake.auth;
  if (!token) {
    return next(new Error("Authentication error"));
  }

  next();
};
