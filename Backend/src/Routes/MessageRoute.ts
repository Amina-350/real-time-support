import express from "express";
import { isAuthenticated } from "../Middleware/auth.js";
import { createMessage, getConversation, getMyChats } from "../Controllers/MessageController.js";
export const router=express.Router();
router.post('/create-message',isAuthenticated,createMessage);
router.get('/getMyChats',isAuthenticated,getMyChats);
router.get(
  "/conversation/:ticketId/:userId",
  isAuthenticated,
  getConversation
);
