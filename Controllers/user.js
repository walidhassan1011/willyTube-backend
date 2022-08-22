import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";
export const update = async (req, res, next) => {
  if (req.params.id === req.user._id) {
    //update user
    try {
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updateUser);
    } catch (err) {}
  } else {
    return next(
      createError(403, "You are not authorized to update this user!")
    );
  }
};
export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user._id) {
    //delete user
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User deleted successfully!");
    } catch (err) {}
  } else {
    return next(
      createError(403, "You are not authorized to delete this user!")
    );
  }
};
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
export const subscribe = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, {
      $push: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: 1 },
    });
    res.status(200).json("subscription successful!");
  } catch (err) {
    next(err);
  }
};
export const unsubscribe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id, {
      $pull: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: -1 },
    });
    res.status(200).json("unsubscription successful!");
  } catch (err) {
    next(err);
  }
};
export const like = async (req, res, next) => {
  const videoId = req.params.id;
  const userId = req.user._id;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: userId },
      $pull: { dislikes: userId },
    });
    res.status(200).json("like successful!");
  } catch (err) {
    next(err);
  }
};
export const dislike = async (req, res, next) => {
  const videoId = req.params.id;
  const userId = req.user._id;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: userId },
      $pull: { likes: userId },
    });
    res.status(200).json("dislike successful!");
  } catch (err) {
    next(err);
  }
};
