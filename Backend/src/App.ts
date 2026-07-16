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
import { router as notificationRouter } from "./Routes/NotificationRoute.js";
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "https://real-time-support.vercel.app/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));

// Static Folder
app.use("/uploads", express.static("public/uploads"));

// Routes
app.use("/user", userRouter);
app.use("/ticket", TicketRouter);
app.use("/message", MessageRouter);
app.use("/notification", notificationRouter);
// Create HTTP Server
const server = http.createServer(app);
// Create Socket Server
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
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
