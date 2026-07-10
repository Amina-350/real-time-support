import { Server, Socket } from "socket.io";

// Store online users (userId -> socketId)
export const onlineUsers = new Map<string, string>();

// Global Socket.IO instance
let ioInstance: Server;

export const initializeSocket = (io: Server): void => {
  ioInstance = io;

  io.on("connection", (socket: Socket) => {
    console.log("Socket Connected:", socket.id);

    socket.on("join", (userId: string) => {
      onlineUsers.set(userId, socket.id);
      console.log("User Joined:", userId);
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      console.log("Disconnected:", socket.id);
    });
  });
};

export const sendRealtimeMessage = (
  userId: string,
  message: unknown
) => {
  const socketId = onlineUsers.get(userId);

  console.log("Receiver:", userId);
  console.log("Socket ID:", socketId);

  if (socketId) {
    ioInstance.to(socketId).emit("new_message", message);
    console.log("Realtime message sent");
  } else {
    console.log("User is offline");
  }
};

export const sendRealtimeNotification = (
  receiverId: string,
  notification: any
) => {

  const socketId = onlineUsers.get(receiverId);

  if (socketId) {
    ioInstance.to(socketId).emit(
      "new_notification",
      notification
    );
  }

};

export const sendNotificationRead = (
  userId: string,
  ticketId: string
) => {
  const socketId = onlineUsers.get(userId);

  if (!socketId) return;

  ioInstance.to(socketId).emit("notification_read", ticketId);
};
