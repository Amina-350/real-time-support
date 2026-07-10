import { Request, Response } from "express";
import User from "../Models/User.js";
import bcrypt from "bcrypt";
import { generateToken } from "../Utils/jwt.js";
import { AuthenticatedRequest } from "../Middleware/auth.js";
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const RegisterUser = new User({
      name: name,
      email: email,
      password: hash,
      role: role,
    });
    const saveuser = await RegisterUser.save();
    return res.json({
      message: "register user",
      user: RegisterUser,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// LOGIN API
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // check fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
 if (user.isBlocked) {
  return res.status(403).json({
    message: "Your account has been blocked by the administrator.",
  });
}

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = generateToken(user._id.toString(), user.role);

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
//get single profile
export const getmyprofile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
//get all customers
export const getcustomers = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    // skip calculation

    const skip = (page - 1) * limit;

    const allcustomers = await User.find({
      role: "customer",
    })
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({
        createdAt: -1,
      });

    // total customers

    const totalCustomers = await User.countDocuments({
      role: "customer",
    });

    return res.status(200).json({
      message: "data fetched successfully",

      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCustomers / limit),
        totalCustomers,
        limit,
      },

      customers: allcustomers,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "internal server error",
    });
  }
};
//get all users
export const getallagents = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    // skip calculation

    const skip = (page - 1) * limit;

    const allagents = await User.find({
      role: "agent",
    })
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({
        createdAt: -1,
      });

    // total customers

    const totalagenst = await User.countDocuments({
      role: "customer",
    });

    return res.status(200).json({
      message: "data fetched successfully",

      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalagenst / limit),
        totalagenst,
        limit,
      },

      customers: allagents,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "internal server error",
    });
  }
};
export const getallusers=async(req: Request, res: Response)=>{
  try{
    const allusers=await User.find();
    res.status(201).json({
        message: "data fetched successfully",
      allusers:allusers,
    })
  }
  catch(err){
    console.log("The error is",err)
  }
}

//block user
export const blockUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,

      {
        isBlocked: true,
      },

      {
        new: true,
      },
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User blocked successfully",

      user,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//unblock user
export const unblockUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,

      {
        isBlocked: false,
      },

      {
        new: true,
      },
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User unblocked successfully",

      user,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


// Get single user profile by ID
export const getSingleProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user,
    });

  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};