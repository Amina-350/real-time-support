import express from "express";
import { adminUpdateTicket, assignTicket, createTicket, deleteticket, filterTicketsByStatus, getAllTickets, getresolvedtickets, getsingleagentdata, getsingleticket, mytickets, updateTicket } from "../Controllers/TicketController.js";
import { isAuthenticated } from "../Middleware/auth.js";
import { upload } from "../Config/Multer.js";
import { authorizeRoles } from "../Utils/rolebase.js";
import { createTicketValidation } from "../Validations/TicketValidation.js";
import { validate } from "../Middleware/Validate.js";
export const router=express.Router();
router.post(
  "/createticket",
  isAuthenticated,
   validate(createTicketValidation),
  upload.single("attachment"),
  createTicket
);
router.get(
  "/myticket",
  isAuthenticated,
  mytickets
);
router.get(
  "/singleticket/:ticketid",
  isAuthenticated,
  getsingleticket
);
router.patch(
  "/updateticket/:tid",
  isAuthenticated,
  upload.single("attachment"),
  updateTicket
);
router.delete(
  "/deleteticket/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteticket
);
router.patch(
  "/assignTicket/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  assignTicket
);

router.get(
  "/getresolvedtickets",
  isAuthenticated,
  getresolvedtickets
);


router.get(
  "/getsingleagentdata/:agentid",
  isAuthenticated,
  getsingleagentdata
);

router.get(
  "/filterTicketsByStatus",
  isAuthenticated,
  filterTicketsByStatus
);

router.get(
  "/getalltickets",
  isAuthenticated,
  getAllTickets
  
);
router.patch(
  "/adminUpdateTicket/:tid",
  isAuthenticated,
  adminUpdateTicket
  
);
