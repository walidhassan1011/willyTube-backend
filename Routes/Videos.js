import express from "express";
import { verifyToken } from "../verifyToken.js";
import {
  addVideo,
  addView,
  deleteVideo,
  getRandom,
  getSubscribed,
  getTrending,
  getVideo,
  getVideoByTags,
  getVideoByTitle,
  updateVideo,
} from "../Controllers/video.js";

const router = express.Router();

//create a video

router.post("/", verifyToken, addVideo);
//update a video
router.put("/:id", verifyToken, updateVideo);
//delete a video
router.delete("/:id", verifyToken, deleteVideo);
//get a video
router.get("/find/:id", getVideo);
//view a video
router.put("/view/:id", addView);
//trending videos
router.get("/trend", getTrending);
//random videos
router.get("/random", getRandom);
//subscribed videos
router.get("/sub", verifyToken, getSubscribed);
//get video by tags
router.get("/tags", getVideoByTags);
//get video by Title
router.get("/search", getVideoByTitle);
export default router;
