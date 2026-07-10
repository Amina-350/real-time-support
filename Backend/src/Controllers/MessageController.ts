import { Response } from "express";
import Message from "../Models/Message.js";
import Ticket from "../Models/Ticket.js";
import { AuthenticatedRequest } from "../Middleware/auth.js";
import { sendRealtimeMessage, sendRealtimeNotification } from "../Socket/Scoket.js";
import Notification from "../Models/Notification.js";

export const createMessage = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const senderId = req.user?.id;

    if (!senderId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { ticketId, receiverId, message } = req.body;

    if (!ticketId || !receiverId || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check ticket exists
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    // ============================
    // Create Message
    // ============================
    const newMessage = await Message.create({
      ticketId,
      senderId,
      receiverId,
      message,
      attachment: req.file ? req.file.filename : "",
      seen: false,
    });

    // Populate message
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "name email role")
      .populate("receiverId", "name email role");

    // ============================
    // Send realtime chat
    // ============================
    sendRealtimeMessage(senderId.toString(), populatedMessage);
    sendRealtimeMessage(receiverId.toString(), populatedMessage);

    // ============================
    // Create Notification
    // ============================
    const notification = await Notification.create({
      userId: receiverId,
      senderId,
      ticketId,
      title: "New Message",
      message: `${
        (populatedMessage?.senderId as any).name
      } sent you a message.`,
      type: "message",
      isRead: false,
    });

    // Populate notification
    const populatedNotification = await Notification.findById(notification._id)
      .populate("senderId", "name email role")
      .populate("userId", "name email role")
      .populate("ticketId", "subject");
console.log("the populated notificatio  is -->",populatedNotification)
    // ============================
    // Send realtime notification
    // ============================
    sendRealtimeNotification(
      receiverId.toString(),
      populatedNotification
    );

    // ============================
    // Response
    // ============================
    return res.status(201).json({
      message: "Message sent successfully",
      data: populatedMessage,
    });

  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};
export const getMyChats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .populate("ticketId", "subject status priority")
      .populate("senderId", "name email role")
      .populate("receiverId", "name email role")
      .sort({ createdAt: -1 });

    // Keep only one chat per ticket (latest message)
    const uniqueChats = [];
    const ticketIds = new Set();

    for (const msg of messages) {
      const ticketId = msg.ticketId._id.toString();

      if (!ticketIds.has(ticketId)) {
        ticketIds.add(ticketId);

        uniqueChats.push({
          ticketId: msg.ticketId,
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          lastMessage: msg.message,
          createdAt: msg.createdAt,
        });
      }
    }

    return res.status(200).json({
      message: "Chats fetched successfully",
      chats: uniqueChats,
    });
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

//converstation between two person
export const getConversation = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const senderId = req.user?.id;

    if (!senderId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { ticketId, userId: reciverID } = req.params;

    const messages = await Message.find({
      ticketId,
      $or: [
        {
          senderId,
          receiverId: reciverID,
        },
        {
          senderId: reciverID,
          receiverId: senderId,
        },
      ],
    })
      .populate("senderId", "name email role")
      .populate("receiverId", "name email role")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      message: "Conversation fetched successfully",
      messages,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};











