import mongoose, { Document, Schema } from "mongoose";

import { IUser } from "../Types/UserTypes.js";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["customer", "agent", "admin"],
      default: "customer",
    },
    isBlocked:{
    type:Boolean,
    default:false
}
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
