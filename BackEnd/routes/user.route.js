import express from "express";
import { body } from "express-validator";
import { registerUser } from "../controller/user.controller.js";

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

export default router;