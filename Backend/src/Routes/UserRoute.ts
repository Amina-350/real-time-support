import express from "express";
import {
  blockUser,
  getallagents,
  getallusers,
  getcustomers,
  getmyprofile,
  getSingleProfile,
  login,
  register,
  unblockUser,
} from "../Controllers/UserController.js";
import { isAuthenticated } from "../Middleware/auth.js";
import { adminUpdateTicket } from "../Controllers/TicketController.js";
import { validate } from "../Middleware/Validate.js";
import { loginValidation, registerValidation } from "../Validations/UserValidation.js";
export const router = express.Router();
router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);
router.get("/getmyprofile", isAuthenticated, getmyprofile);
router.get("/getcustomers", isAuthenticated, getcustomers);
router.get("/getallagents", isAuthenticated, getallagents);
router.patch("/blockuser/:id", isAuthenticated, blockUser);
router.patch("/unblockUser/:id", isAuthenticated, unblockUser);
router.get("/getallusers", isAuthenticated,getallusers);
router.get('/getsigleprofile/:id',isAuthenticated,getSingleProfile);
router.get('/adminUpdateTicket/:tid',isAuthenticated,adminUpdateTicket);
