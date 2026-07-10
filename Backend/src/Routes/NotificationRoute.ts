import express from "express";
import {
  getMyNotifications,
  getUnreadNotificationCount,
  markTicketNotificationsRead,
  deleteNotification,
} from "../Controllers/NotificationController.js";
import { isAuthenticated } from "../Middleware/auth.js";

export const router = express.Router();

router.get("/my-notifications", isAuthenticated, getMyNotifications);

router.get("/unread-count", isAuthenticated, getUnreadNotificationCount);

router.patch("/read-ticket/:id", isAuthenticated, markTicketNotificationsRead);

router.patch("/read-all", isAuthenticated, markTicketNotificationsRead);

router.delete("/:id", isAuthenticated, deleteNotification);