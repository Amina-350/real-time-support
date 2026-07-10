import { Request, Response } from "express";
import Ticket from "../Models/Ticket.js";
import { AuthenticatedRequest } from "../Middleware/auth.js";
import User from "../Models/User.js";
//create Ticket
export const createTicket = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { agentId, subject, category, priority, status } = req.body;
    const customerId = req.user?.id;
    if (!customerId) {
      return res.status(401).json({
        message: "customerId not found",
      });
    }

    let attachment = "";

    if (req.file) {
      attachment = req.file.path; // cloudinary url
    }

    const createticket = new Ticket({
      customerId,
      agentId,
      subject,
      category,
      priority,
      status,
      attachment,
    });

    const newticket = await createticket.save();

    return res.status(201).json({
      message: "created successfully",
      ticket: newticket,
    });
  } catch (error: any) {
    console.log("ERROR:", error);

    return res.status(500).json({
      message: error.message || "internal server error",
    });
  }
};

// Get the loggedIn person created tickets or my teckets(agent or admin or user)
export const mytickets = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const tickets = await Ticket.find({
      customerId: userId,
    }).populate("agentId", "name email");;

    if (!tickets.length) {
      return res.status(404).json({
        message: "No tickets found",
      });
    }

    return res.status(200).json({
      message: "My tickets fetched successfully",
      tickets,
    });
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};
//get the single ticket
export const getsingleticket = async (req: Request, res: Response) => {
  try {
    const { ticketid } = req.params;
    const ticketres = await Ticket.findById(ticketid);
    console.log("tickets are", ticketres);
    if (!ticketres) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }
    return res.status(201).json({
      message: "success",
      ticketres,
    });
  } catch (err) {
    res.status(500).json({
      message: "error",
    });
  }
};
//update ticket
export const updateTicket = async (
  req: AuthenticatedRequest,

  res: Response,
) => {
  try {
    const { tid } = req.params;

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const ticket = await Ticket.findById(tid);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }
    if (ticket.customerId.toString() !== userId) {
      return res.status(403).json({
        message: "You cannot update this ticket",
      });
    }
    const { subject, category, priority, status, agentId } = req.body;
    if (subject) ticket.subject = subject;
    if (category) ticket.category = category;

    if (priority) ticket.priority = priority;

    if (status) ticket.status = status;

    if (agentId) ticket.agentId = agentId;

    if (req.file) {
      ticket.attachment = req.file.filename;
    }
    const updatedTicket = await ticket.save();

    return res.status(200).json({
      message: "Ticket updated successfully",
      ticket: updatedTicket,
    });
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};
// delete ticket
export const deleteticket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Ticket.findByIdAndDelete(id);
    return res.status(201).json({
      message: "Ticket deleted successfully",
    });
  } catch {
    return res.status(500).json({
      message: "internal server error",
    });
  }
};
//assignment ticket to agent
export const assignTicket = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { id } = req.params;

    console.log("ticketid", id);

    const { agentId } = req.body;
    // check agent exists

    const agent = await User.findOne({
      _id: agentId,
    });

    if (!agent) {
      return res.status(404).json({
        message: "Agent not found",
      });
    }

    // assign ticket

    const ticket = await Ticket.findByIdAndUpdate(
      id,

      {
        agentId: agent._id,

        status: "in-progress",
      },

      {
        new: true,
      },
    )
      .populate("agentId", "name email role")
      .populate("customerId", "name email");

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      message: "Ticket assigned successfully",

      ticket,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get all resolved tickets
export const getresolvedtickets = async (req: Request, res: Response) => {
  try {
    // Fetch all resolved tickets
    const resolvedTickets = await Ticket.find({
      status: "resolved",
    })
      .populate("agentId") // Populate agent details
      .sort({
        createdAt: -1,
      });

    // Count resolved tickets
    const totalResolved = await Ticket.countDocuments({
      status: "resolved",
    });

    return res.status(200).json({
      message: "Resolved tickets fetched successfully",
      totalResolved,
      tickets: resolvedTickets,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

// get single agent tickets
export const getsingleagentdata = async (req: Request, res: Response) => {
  try {
    const { agentid } = req.params;

    const allagenttickets = await Ticket.find({
      agentId: agentid,
    })
      .populate("customerId", "name email")
      .populate("agentId", "name email");

    return res.status(200).json({
      message: "Agent tickets fetched successfully",

      tickets: allagenttickets,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

//get tickets by status filter
// filter tickets by status

export const filterTicketsByStatus = async(
  req: Request,
  res: Response
)=>{

try{


const { status } = req.query;



if(!status)
{
    return res.status(400).json({
        message:"Status is required"
    });
}



const tickets = await Ticket.find({
    status: status
})
.populate(
    "customerId",
    "name email"
)
.populate(
    "agentId",
    "name email"
);



return res.status(200).json({

    message:"Tickets filtered successfully",

    tickets

});


}
catch(error:any)
{

return res.status(500).json({

    message:error.message || "Internal server error"

});

}


}

// Get all tickets with pagination
export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const tickets = await Ticket.find()
      .populate("agentId") // Fetch complete agent details
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalTickets = await Ticket.countDocuments();

    return res.status(200).json({
      message: "Tickets fetched successfully",
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalTickets / limit),
        totalTickets,
        limit,
      },
      tickets,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

//admin update ticket
export const adminUpdateTicket = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { tid } = req.params;

    const ticket = await Ticket.findById(tid);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    const { status, agentId, priority } = req.body;

    if (status) ticket.status = status;

    if (agentId) ticket.agentId = agentId;

    if (priority) ticket.priority = priority;

    const updatedTicket = await ticket.save();

    return res.status(200).json({
      message: "Ticket updated successfully",
      ticket: updatedTicket,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};