import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "production"
    ? "http://localhost:4000"
    : "http://localhost:4000";

export const mailSocket = io(URL, {
  autoConnect: false,
});
