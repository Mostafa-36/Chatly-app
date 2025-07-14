import AppError from "../errors/AppError.js";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.js";
import signToken from "../utils/signToken.js";
import setTokenCookie from "../utils/setTokenCookie.js";

export const signup = catchAsync(async (req, res, next) => {
  const { email, fullName, password } = req.body;

  const newUser = await User.create({
    email: email,
    fullName: fullName,
    password: password,
  });

  const token = signToken(newUser._id);

  setTokenCookie(res, token);

  res.status(201).json({
    status: "success",
    data: {
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("All required fields must be provided.", 400));

  const existingUser = await User.findOne({ email }).select("+password");

  if (!existingUser) return next(new AppError("Invalid credentials.", 400));

  const isValid = await existingUser.correctPassword(`${password}`);

  if (!isValid) return next(new AppError("Invalid credentials.", 401));

  const token = signToken(existingUser._id);

  setTokenCookie(res, token);

  res.status(200).json({
    status: "success",
    data: {
      _id: existingUser._id,
      fullName: existingUser.fullName,
      email: existingUser.email,
      profilePic: existingUser.profilePic,
    },
  });
});

export const logout = catchAsync(async (req, res, next) => {
  res.cookie("token", "", { maxAge: 0 });
  res.status(200).json({
    status: "success",
    message: "Logged Out successfully",
  });
});

export const checkAuth = catchAsync(async (req, res, next) => {
  res.status(200).json(req.user);
});

export const updateProfile = catchAsync(async (req, res, next) => {
  const { profilePic } = req.body;

  if (!profilePic)
    return next(new AppError("Please upload a profile image.", 400));

  const uploadProfilePic = await cloudinary.uploader.upload(profilePic, {
    folder: "chatly-messages",
  });

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { profilePic: uploadProfilePic.secure_url },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});
