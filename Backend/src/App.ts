import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { router as userRouter } from "./Routes/UserRoute.js";
import { router as TicketRouter } from "./Routes/TicketRoute.js";
import { router as MessageRouter } from "./Routes/MessageRoute.js";
import { connectDB } from "./Config/db.js";
import { initializeSocket } from "./Socket/Scoket.js";
import{ router as notificationRouter} from './Routes/NotificationRoute.js';
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));

// Static Folder
app.use("/uploads", express.static("public/uploads"));

// Routes
app.use("/api/user", userRouter);
app.use("/api/ticket", TicketRouter);
app.use("/api/message", MessageRouter);
app.use("/api/notification", notificationRouter);
// Create HTTP Server
const server = http.createServer(app);

// Create Socket Server
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

initializeSocket(io);
// Database
connectDB();

// Start Server
const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});