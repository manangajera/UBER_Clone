import { createUser } from "../service/user.service.js";
import { validationResult } from "express-validator";
import USER from "../models/user.model.js";

export const registerUser = async (req, res, next) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }

    const { fullname: { firstname, lastname }, email, password } = req.body;
    const hashedPassword = await USER.hashPassword(password);

    const user = await createUser(firstname, lastname, email, hashedPassword);
    const token = user.generateAuthToken();
    
    res.status(201).json({
      message: "User Created Successfully",
      user,
      token,
    });
  } catch (err) {
    next(err);
  }
};
