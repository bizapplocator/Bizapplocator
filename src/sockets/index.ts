import { Server } from "socket.io";
import app from "../index.ts";
import http from "http";
import { createServer } from "http";

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
