import * as http from "http";
import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import prisma from "./prisma";
import { Server } from "socket.io";

const PORT = process.env.PORT || 4000;

const httpServer: http.Server = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_SERVER,
  },
});

io.on("connection", (socket) => {
  console.log(socket.id, "socket_id");
});
app.set("socketio", io);

async function startServer(): Promise<void> {
  httpServer.listen(PORT, () => {
    console.log("listening to server on", PORT);
  });
}

startServer();

httpServer.on("close", async () => {
  await prisma.$disconnect();
});
