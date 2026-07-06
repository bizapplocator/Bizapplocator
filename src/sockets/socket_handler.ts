import { io } from "./index.ts";
export const socketController = {
  io,
  onConnection: (callback: (socket: any) => void) => {
    io.on("connection", callback);
  },
};
