import mongoose from "mongoose";
import User from "../models/User.js";
import bycrypt from "bcryptjs";
import { createError } from "../error.js";
import Jwt from "jsonwebtoken";
export const signup = async (req, res, next) => {
  try {
    const salt = bycrypt.genSaltSync(10);
    const hash = bycrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });
    await newUser.save();
    res.status(200).send({ message: "User created successfully" });
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
    const token = Jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    const { password, ...others } = user._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(others);
  } catch (err) {
    next(err);
  }
};
