import mongoose, { Schema, Document } from "mongoose";

export interface ITicket extends Document {
  customerId: mongoose.Types.ObjectId;
  agentId?: mongoose.Types.ObjectId;
  subject: string;
  category:
    | "technical"
    | "billing"
    | "account"
    | "payment"
    | "bug"
    | "feature-request"
    | "other";
priority: "low" | "medium" | "high";
status: "open" | "in-progress" | "pending" | "resolved" | "closed";
attachment: string;
  createdAt: Date;
}
