import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import bcrypt from "bcrypt";
import { sendJWTToken } from "../utils/sendJWTToken.js";
import { Token } from "../models/Token.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import { Network } from "../models/Network.js";
import getDataUri from "../utils/dataURI.js";
import cloudinary from "cloudinary";

export const signup = catchAsyncError(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return next(new ErrorHandler("Enter all the fields", 401));

  const check = await User.findOne({ email });

  if (check)
    return next(new ErrorHandler("Email already present try another", 400));

  const user = await User.create({ username, email, password });

  const check2 = await Token.findOne({ userId: user._id });

  if (check2) {
    await Token.findOneAndDelete({ userId: user._id });
  }

  const generatedToken = crypto.randomBytes(20).toString("hex");
  const generatedToken2 = crypto
    .createHash("sha256")
    .update(generatedToken)
    .digest("hex");

  const token = await Token.create({
    userId: user._id,
    token: generatedToken2,
    message: `Email Verification Send To ${user.email}`,
  });

  const url = `${process.env.FRONTEND_URL}/verify/${generatedToken2}`;

  const message = `Click on the link to verfiy the account. ${url} If you have not requested then please ignore.`;

  await sendEmail(user.email, "Account Verification", message);

  res.status(200).json({
    success: true,
    user,
  });
});

export const verify = catchAsyncError(async (req, res, next) => {
  const token = req.body.token;

  if (!token) return next(new ErrorHandler("Page Not Found!", 401));

  const tokenFound = await Token.findOne({ token });

  if (!tokenFound)
    return next(new ErrorHandler("Invalid token or Limit Exceeded", 401));

  const user = await User.findById(tokenFound.userId);

  if (!user)
    return next(new ErrorHandler("Invalid token or Limit Exceeded", 401));

  user.isVerified = true;
  await user.save();

  //Create a network as soon as the user is verified

  let network = await Network.create({ userId: user._id });

  res.status(200).json({
    success: true,
    message: "User Verified Successfully",
    user,
    network,
  });
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  // console.log(email, password);

  if (!email || !password)
    return next(new ErrorHandler("Enter all the fields", 401));

  const user = await User.findOne({ email });

  if (!user) return next(new ErrorHandler("Invalid email or password", 401));

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return next(new ErrorHandler("Invalid email or password", 401));

  sendJWTToken(res, user, `Welcome Back ${user.username}`, 200);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("authToken", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

export const getMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) return next(new ErrorHandler("User Not Found!", 404));
  res.status(200).json({
    success: true,
    user,
  });
});
export const getUserDetails = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;

  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("User Not Found!", 404));

  res.status(200).json({
    success: true,
    user,
  });
});

export const getAllNetwork = catchAsyncError(async (req, res, next) => {
  const user = await User.find();

  res.status(200).json({
    success: true,
    user,
  });
});

export const createNetwork = catchAsyncError(async (req, res, next) => {
  const userId = req.body.userId;

  if (!userId) return next(new ErrorHandler("Enter the userid", 401));

  const user = await User.findById(userId);

  if (!user) return next(new ErrorHandler("User Not Found!", 404));

  let network = await Network.find({ userId: userId });

  if (network)
    return next(
      new ErrorHandler("Network All Ready Present For This User!", 401)
    );

  network = await Network.create({ userId: userId });

  res.status(201).json({
    success: true,
    network,
  });
});

export const getMyNetwork = catchAsyncError(async (req, res, next) => {
  const userId = req.query.id;

  if (!userId) return next(new ErrorHandler("Enter the userid", 401));

  const user = await User.findById(userId);

  if (!user) return next(new ErrorHandler("User Not Found!", 404));

  const network = await Network.findOne({ userId: userId });

  if (!network) return next(new ErrorHandler("No Network Found!", 404));

  const networkUserIds = network.networkArray;

  let usersData = [];

  try {
    await Promise.all(
      networkUserIds.map(async (id) => {
        const userData = await User.findById(id);
        if (userData) usersData.push(userData);
      })
    );
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data." });
  }

  res.status(201).json({
    success: true,
    network,
    usersData,
  });
});

export const addUserToNetwork = catchAsyncError(async (req, res, next) => {
  const { userId1, userId2 } = req.body;

  if (!userId1 || !userId2)
    return next(new ErrorHandler("Enter both userids", 401));

  const user1 = await User.findById(userId1);
  const user2 = await User.findById(userId2);

  if (!user1) return next(new ErrorHandler("User1 Not Found!", 404));

  if (!user2) return next(new ErrorHandler("User2 Not Found!", 404));

  const network = await Network.findOne({ userId: userId1 });

  if (!network) return next(new ErrorHandler("No Network Found!", 404));

  const prevArray = network.networkArray;
  let check = false;

  prevArray.map((id) => {
    if (id == userId2) check = true;
  });
  if (check) return next(new ErrorHandler("User Already In The Network!", 401));

  network.networkArray.push(userId2);
  network.save();

  res.status(201).json({
    success: true,
    network,
  });
});

export const updateMyProfile = catchAsyncError(async (req, res, next) => {
  const { username, description, designation } = req.body;

  const profileImage = req.file;
  // const backgroundImage = req.file;

  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) return next(new ErrorHandler("User Not Found!", 401));

  if (username) {
    user.username = username;
    await user.save();
  }
  if (description) {
    user.description = description;
    await user.save();
  }
  if (designation) {
    user.designation = designation;
    await user.save();
  }

  if (profileImage) {
    const fileUri = getDataUri(profileImage);

    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

    const newImage = [
      {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      },
    ];

    user.profileImage = newImage;
    await user.save();
  }

  res.status(201).json({
    success: true,
    user,
  });
});
export const updateBackgroundImage = catchAsyncError(async (req, res, next) => {
  const backgroundImage = req.file;

  const userId = req.user._id;

  const user = await User.findById(userId);

  if (backgroundImage) {
    const fileUri = getDataUri(backgroundImage);

    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

    const newImage = [
      {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      },
    ];

    user.backgroundImage = newImage;
    await user.save();
  }

  res.status(201).json({
    success: true,
    user,
  });
});

export const addSkill = catchAsyncError(async (req, res, next) => {
  const skill = req.body.skill;

  const userId = req.user._id;

  const user = await User.findById(userId);

  user.skills.push(skill);
  await user.save();

  res.status(201).json({
    success: true,
    user,
  });
});

export const addEducation = catchAsyncError(async (req, res, next) => {
  const education = req.body.education;

  const userId = req.user._id;

  const user = await User.findById(userId);

  user.education.push(education);
  await user.save();

  res.status(201).json({
    success: true,
    user,
  });
});
