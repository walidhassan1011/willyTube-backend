import express from "express";
import { google, signin, signup } from "../Controllers/auth.js";
const router = express.Router();
import cookieParser from "cookie-parser";
router.use(cookieParser());
//create a new user

router.post("/signup", signup);

//sign in a user
router.post("/signin", signin);
//google Auth
router.post("/google", google);
export default router;
