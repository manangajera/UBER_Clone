import { validationResult } from "express-validator";
import { registerCaptain } from "../service/captain.service.js";
import CAPTAIN from "../models/captain.model.js";
import BlacklistedToken from "../models/blacklisttoken.model.js";

export const createCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    fullname: { firstname, lastname },
    email,
    password,
    vehicle: { color, plate, type, capacity },
  } = req.body;

  try {
    const existingCaptain = await CAPTAIN.findOne({ email });
    if (existingCaptain) {
      return res.status(400).json({ message: "Captain with this email already exists" });
    }

    const hashedPassword = await CAPTAIN.hashPassword(password);

    const captain = await registerCaptain({
      fullname: { firstname, lastname },
      email,
      password: hashedPassword,
      vehicle: { color, plate, type, capacity },
    });

    const token = captain.generateAuthToken();

    res.status(201).json({ message: "Captain created successfully", captain, token });
  } catch (error) {
    next(error);
  }
};

export const loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const captain = await CAPTAIN.findOne({ email }).select("+password");
    if (!captain) {
      return res.status(404).json({ message: "Captain not found" });
    }

    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = captain.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    }); 
    captain.password = undefined; // Remove password from response
    res.status(200).json({ message: "Login successful", captain });
  } catch (error) {
    next(error);
  }
}

export const getCaptainProfile = async (req, res, next) => {
  try {
    const captain = req.captain; // From authCaptain middleware
    if (!captain) {
      return res.status(404).json({ message: "Captain not found" });
    }
    res.status(200).json({ captain });
  } catch (error) {
    next(error);
  }
}

export const logoutCaptain = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }
    await BlacklistedToken.create({ token });
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
}