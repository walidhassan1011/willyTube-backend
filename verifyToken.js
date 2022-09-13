import Jwt from "jsonwebtoken";
import { createError } from "./error.js";
export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) return next(createError(401, "you are not authenticated!"));
  Jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));

    req.user = user;
    next();
  });
};
