import mongoose from "mongoose";
import User from "../models/User.js";
import bycrypt from "bcryptjs";
import { createError } from "../error.js";
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

export const signup = async (req, res, next) => {
  try {
    const salt = bycrypt.genSaltSync(10);
    const hash = bycrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });
    await newUser.save();
    const token = Jwt.sign(
      { email: newUser.email, _id: newUser._id },
      process.env.JWT_SECRET
    );
    res.status(200).send({ newUser, token });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const isCorrect = await bycrypt.compare(req.body.password, user.password);
    if (!isCorrect) return next(createError(400, "Incorrect password"));
    const token = Jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET
    );
    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, token });
  } catch (err) {
    next(err);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = Jwt.sign(
        { email: user.email, _id: user._id },
        process.env.JWT_SECRET
      );

      res.status(200).json({ ...user._doc, token });
    } else {
      const newUser = new User({ ...req.body, fromGoogle: true });
      const savedUser = await newUser.save();
      const token = Jwt.sign(
        { email: newUser.email, _id: savedUser._id },
        process.env.JWT_SECRET
      );
      res.status(200).send({ ...savedUser, token });
    }
  } catch (err) {
    next(err);
  }
};
