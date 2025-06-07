import express, { application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import UserRoutes from "./routes/user.route.js";
import CaptainRoutes from "./routes/captain.route.js";
import cookieParser from "cookie-parser";
dotenv.config()


export const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({credentials: true,}))
app.use(cookieParser());
app.use("/api/user", UserRoutes);
app.use("/api/captain", CaptainRoutes);
app.get("/", (req, res) => {
    res.send("Welcome to the backend server");
})