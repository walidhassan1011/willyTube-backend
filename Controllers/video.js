import { createError } from "../error.js";
import Video from "../models/Video.js";
import User from "../models/User.js";
export const addVideo = async (req, res, next) => {
  const newVideo = new Video({
    userId: req.user._id,
    ...req.body,
  });
  try {
    const saveVideo = await newVideo.save();
    res.status(200).json(saveVideo);
  } catch (err) {
    next(err);
  }
};
export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id);
    if (!video) {
      return next(createError(404, "Video not found!"));
    }
    if (req.user._id === video.userId) {
      const updateVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updateVideo);
    } else {
      return next(
        createError(403, "You are not authorized to update this video!")
      );
    }
  } catch (err) {
    next(err);
  }
};
export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return next(createError(404, "Video not found!"));
    }
    if (req.user._id === video.userId) {
      const deleteVideo = await Video.findByIdAndDelete(req.params.id);
      res.status(200).json("Video deleted successfully!");
    } else {
      return next(
        createError(403, "You are not authorized to delete this video!")
      );
    }
  } catch (err) {
    next(err);
  }
};
export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return next(createError(404, "Video not found!"));
    }
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};
export const addView = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json("View added successfully!");
  } catch (err) {
    next(err);
  }
};
export const getTrending = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};
export const getRandom = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([
      {
        $sample: { size: 40 },
      },
    ]);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};
export const getSubscribed = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const subscribedChannels = user.subscribedUsers;
    const list = await Promise.all(
      subscribedChannels.map(async (channelId) => {
        const videos = await Video.find({ userId: channelId });
        return videos;
      })
    );
    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    next(err);
  }
};
export const getVideoByTags = async (req, res, next) => {
  const tags = req.query.tags.split(",");
  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};
export const getVideoByTitle = async (req, res, next) => {
  const title = req.query.title;
  try {
    const videos = await Video.find({
      title: { $regex: title, $options: "i" },
    }).limit(40);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};
