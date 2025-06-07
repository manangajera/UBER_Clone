import express from "express";
import { body } from "express-validator";
import {
  loginUser,
  registerUser,
  getProfile,
  logoutUser
} from "../controller/user.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be atleast length with 3"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be atleast length with 6"),
  ],
  registerUser
);
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be atleast length with 6"),
  ],
  loginUser
);

router.get("/profile", authUser, getProfile);

router.get("/logout", logoutUser);
export default router;
