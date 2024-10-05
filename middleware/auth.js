import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Partner from "../models/partnerModel.js";


export const userAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized, no token provided!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Unauthorized, token is invalid!" });
  }
};

export const partnerAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized, no token provided!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const partner = await Partner.findById(decoded._id);
    if (!partner) {
      return res.status(404).json({ message: "Partner not found!" });
    }

    req.partner = partner;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Unauthorized, token is invalid!" });
  }
};
