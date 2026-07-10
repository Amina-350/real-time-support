import mongoose, { Schema, Document } from "mongoose";
import { ITicket } from "../Types/TicketTypes.js";
const ticketSchema = new Schema<ITicket>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    agentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    subject: {
      type: String,
      required: true,
    },
  category:{
    type:String,
    enum:[
        "technical",
        "billing",
        "account",
        "payment",
        "bug",
        "feature-request",
        "other"
    ],
    required:true
},
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "pending", "resolved", "closed"],
      default: "open",
    },
    attachment:String,
  },
  {
    timestamps: true,
  },
);
export default mongoose.model<ITicket>("Ticket", ticketSchema);
