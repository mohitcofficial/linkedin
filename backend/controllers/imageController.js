import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Image } from "../models/Image.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import getDataUri from "../utils/dataURI.js";
import cloudinary from "cloudinary";
import crypto from "crypto-js";

export const uploadProfilePhoto = catchAsyncError(async (req, res, next) => {
  const file = req.file;

  if (!file) return next(new ErrorHandler("No File Found", 404));

  if (file.size > 10e6)
    return next(new ErrorHandler("File should be less than 10MB", 403));

  const user = await User.findById(req.user._id);

  const fileUri = getDataUri(file);

  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
  // let cipherUrl = crypto.AES.encrypt(
  //   mycloud.secure_url,
  //   process.env.CRYPTO_KEY
  // );

  const newImage = [
    {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
  ];

  user.profileImage = newImage;

  await user.save();
  res.status(200).json({
    success: true,
    user,
  });
});
export const uploadBackgroundPhoto = catchAsyncError(async (req, res, next) => {
  const file = req.file;

  if (!file) return next(new ErrorHandler("No File Found", 404));

  if (file.size > 10e6)
    return next(new ErrorHandler("File should be less than 10MB", 403));

  const user = await User.findById(req.user._id);

  const fileUri = getDataUri(file);

  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
  // let cipherUrl = crypto.AES.encrypt(
  //   mycloud.secure_url,
  //   process.env.CRYPTO_KEY
  // );

  const newImage = [
    {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
  ];

  user.backgroundImage = newImage;

  await user.save();

  res.status(200).json({
    success: true,
    user,
  });
});

export const uploadImage = catchAsyncError(async (req, res, next) => {
  const { caption } = req.body;
  const file = req.file;

  if (!caption) return next(new ErrorHandler("Please enter the caption", 400));

  if (!file) return next(new ErrorHandler("No File Found", 404));

  if (file.size > 10e6)
    return next(new ErrorHandler("File should be less than 10MB", 403));

  const user = await User.findById(req.user._id);

  const fileUri = getDataUri(file);

  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

  const image = await Image.create({
    caption: caption,
    userId: user._id,
    image: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
  });

  res.status(200).json({
    success: true,
    image,
  });
});

export const myUploads = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  let imageArray = await Image.find({ userId: userId });

  res.status(200).json({
    success: true,
    imageArray,
  });
});
