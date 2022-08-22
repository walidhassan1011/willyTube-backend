import express from "express";
import {
  addComment,
  deleteComment,
  getComments,
} from "../Controllers/comment.js";
import { verifyToken } from "../verifyToken.js";
const router = express.Router();

router.post("/", verifyToken, addComment);
router.get("/:videoId", getComments);
router.delete("/:id", verifyToken, deleteComment);

export default router;
