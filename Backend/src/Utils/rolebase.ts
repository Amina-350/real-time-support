import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../Middleware/auth.js";

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You don't have permission",
      });
    }
    next();
  };
};
