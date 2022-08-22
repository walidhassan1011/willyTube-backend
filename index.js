import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./Routes/Users.js";
import videoRoutes from "./Routes/Videos.js";
import commentRoutes from "./Routes/Comments.js";
import authRoutes from "./Routes/auth.js";
import cookieParser from "cookie-parser";

//---------------------------------------------------------------------------------//
const app = express();
dotenv.config();
app.use(cookieParser());
app.use(express.json());
const connect = () => {
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log("connected to mongo");
    })
    .catch((err) => {
      throw err;
    });
};
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  res.status(status).json({ success: false, message, status });
});

app.listen(5000, () => {
  connect();
  console.log("Server is running on port 5000");
});
