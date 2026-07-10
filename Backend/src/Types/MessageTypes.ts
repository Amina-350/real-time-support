import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  ticketId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  message: string;
  attachment?: string;
  seen: boolean;
  createdAt: Date;
  updatedAt: Date;
}
