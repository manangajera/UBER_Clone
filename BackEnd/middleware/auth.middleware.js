import jwt from "jsonwebtoken";
import USER from "../models/user.model.js";
import BlacklistedToken from "../models/blacklisttoken.model.js";
import CAPTAIN from "../models/captain.model.js";


export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (await BlacklistedToken.findOne({ token })) {
      return res.status(401).json({ message: "Unauthorized" });
    } 
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await USER.findById(decoded._id);
    req.user = user; // Attach user info to request object
    return next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export const authCaptain = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (await BlacklistedToken.findOne({ token })) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await CAPTAIN.findById(decoded._id);
    req.captain = captain; // Attach captain info to request object
    return next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
}
