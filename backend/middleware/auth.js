import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { catchAsyncError } from "./catchAsyncError.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { authToken } = req.cookies;

  if (!authToken) return next(new ErrorHandler("Not logged in!", 401));

  const decoded = jwt.verify(authToken, "oinfiosdfnodsifisnfosifsnodfsino");

  req.user = await User.findById(decoded._id);

  next();
});

export const isVerified = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  if (!user.verified)
    return next(new ErrorHandler("You are not verified!", 401));

  next();
});

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return next(
      new ErrorHandler(`${req.user.role} is not allowed to acces`),
      403
    );

  next();
};
