import { Response } from "express";
import Notification from "../Models/Notification.js";
import { AuthenticatedRequest } from "../Middleware/auth.js";
import { sendNotificationRead } from "../Socket/Scoket.js";


// ==========================================
// Get Logged-in User Notifications
// ==========================================
export const getMyNotifications = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const notifications = await Notification.find({
      userId,
    })
      .populate("senderId", "name email role")
      .populate("ticketId", "subject priority status")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Notifications fetched successfully",
      notifications,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

// ==========================================
// Get Unread Notification Count
// ==========================================
export const getUnreadNotificationCount = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false,
    });

    return res.status(200).json({
      message: "Unread notifications fetched successfully",
      unreadCount,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};



export const markTicketNotificationsRead = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { ticketId } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    await Notification.updateMany(
      {
        userId,
        ticketId,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    // Notify frontend
    sendNotificationRead(userId.toString(),`${ticketId}`);

    return res.status(200).json({
      message: "Notifications marked as read",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// ==========================================
// Delete Notification
// ==========================================
export const deleteNotification = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const notification = await Notification.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      message: "Notification deleted has successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};