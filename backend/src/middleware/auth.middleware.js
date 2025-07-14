import AppError from "../errors/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    return next(
      new AppError(
        "You are not logged in logged in Please log in to get access",
        401
      )
    );

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRETKEY);

  const freshUser = await User.findById(decoded.id);

  if (!freshUser)
    return next(
      new AppError(
        "the token belonging to this user does no longer exist.",
        401
      )
    );

  req.user = freshUser;

  next();
});

export default protect;
