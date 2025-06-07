import { createUser, login } from "../service/user.service.js";
import { validationResult } from "express-validator";
import USER from "../models/user.model.js";
import BlacklistedToken from "../models/blacklisttoken.model.js";

export const registerUser = async (req, res, next) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }

    const {
      fullname: { firstname, lastname },
      email,
      password,
    } = req.body;
    const hashedPassword = await USER.hashPassword(password);
    if (await USER.findOne({ email })) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const user = await createUser(firstname, lastname, email, hashedPassword);
    const token = user.generateAuthToken();

    res.status(201).json({
      message: "User Created Successfully",
      user: { id: user._id, email: user.email }, // Send only non-sensitive user data
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }

    const { email, password } = req.body;
    const user = await login(email, password);
    console.log(user);
    const token = user.generateAuthToken();
     res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiry
    });
    res.status(200).json({
      message: "User Logged In Successfully",
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    // User is already attached by authUser middleware
    const { _id, email, fullname } = req.user;
    
    res.status(200).json({
      message: "Profile retrieved successfully",
      user: { _id, email, fullname },
    });
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Add token to blacklist
    const blacklistedToken = new BlacklistedToken({ token });
    await blacklistedToken.save();
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({ message: "User Logged Out Successfully" });
  } catch (err) {
    next(err);
  }
};  