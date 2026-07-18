import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { router as userRouter } from "./Routes/UserRoute.js";
import { router as TicketRouter } from "./Routes/TicketRoute.js";
import { router as MessageRouter } from "./Routes/MessageRoute.js";
import { router as notificationRouter } from "./Routes/NotificationRoute.js";
import { connectDB } from "./Config/db.js";
import { initializeSocket } from "./Socket/Scoket.js";

dotenv.config();
const app = express();
// ===============================
// Middleware
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// CORS Configuration
// ===============================

// ALLOWED_ORIGINS=http://localhost:3000,https://real-time-support.vercel.app
const allowedOrigins=process.env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()) || [];



app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, mobile apps, etc.)
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
// ===============================
// Static Files
// ===============================
app.use("/uploads", express.static("public/uploads"));
// ===============================
// API Routes
// ===============================
app.use("/api/user", userRouter);
app.use("/api/ticket", TicketRouter);
app.use("/api/message", MessageRouter);
app.use("/api/notification", notificationRouter);

// ===============================
// Create HTTP Server
// ===============================
const server = http.createServer(app);

// ===============================
// Socket.IO
// ===============================
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

initializeSocket(io);

// ===============================
// Connect Database
// ===============================
connectDB();

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});