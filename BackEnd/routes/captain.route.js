import express from "express";
import { body } from "express-validator";
import { createCaptain ,loginCaptain,getCaptainProfile,logoutCaptain} from "../controller/captain.controller.js";
import { authCaptain } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("fullname.firstname").notEmpty().isLength({ min: 3 }),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("vehicle.color").notEmpty(),
    body("vehicle.plate").notEmpty(),
    body("vehicle.type").isIn(["Car", "Bike", "Auto"]),
    body("vehicle.capacity").isInt({ min: 1 }),
  ],
  createCaptain
);

router.post("/login",
    [
        body("email").isEmail().normalizeEmail(),
        body("password").isLength({ min: 6 }),
    ],
    loginCaptain
);  

router.get("/profile",authCaptain,getCaptainProfile);

router.get("/logout",authCaptain,logoutCaptain);
export default router;
