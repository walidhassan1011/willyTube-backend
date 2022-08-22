import express from "express";
import {
  deleteUser,
  dislike,
  getUser,
  like,
  subscribe,
  unsubscribe,
  update,
} from "../Controllers/user.js";
import { verifyToken } from "../verifyToken.js";
const router = express.Router();

//update user
router.put("/:id", verifyToken, update);
//delete user
router.delete("/:id", verifyToken, deleteUser);
//get a user
router.get("/:id", verifyToken, getUser);

//subcribe a user

router.put("/subscribe/:id", verifyToken, subscribe);

//unsubscribe a user

router.put("/unsubscribe/:id", verifyToken, unsubscribe);

//like a video

router.put("/like/:videoId", verifyToken, like);

//dislike a video
router.put("/dislike/:videoId", verifyToken, dislike);

export default router;
