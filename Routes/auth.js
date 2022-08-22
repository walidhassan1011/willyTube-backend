import express from "express";
import { signin, signup } from "../Controllers/auth.js";
const router = express.Router();

//create a new user

router.post("/signup", signup);

//sign in a user
router.post("/signin", signin);
//google Auth
router.post("/google", (req, res) => {});
export default router;
