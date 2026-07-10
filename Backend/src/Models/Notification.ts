import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    ticketId: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
    },

    title: String,

    message: String,

    type: {
      type: String,
      default: "message",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Notification", notificationSchema);