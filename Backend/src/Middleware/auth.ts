import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";
export interface AuthPayload {
  id: string;
  role: string;
}
// extend Request
export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}
export const isAuthenticated = async(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as AuthPayload;
const user = await User.findById(decoded.id);
    if (user?.isBlocked) {
      return res.status(403).json({
        message: "Your account has been blocked.",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
