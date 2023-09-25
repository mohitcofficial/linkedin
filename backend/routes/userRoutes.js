import express from "express";
import {
  login,
  logout,
  signup,
  verify,
  getMyProfile,
  getUserDetails,
  getAllNetwork,
  getMyNetwork,
  createNetwork,
  addUserToNetwork,
  updateMyProfile,
  updateBackgroundImage,
  addSkill,
  addEducation,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/auth.js";
import singleUpload from "../middleware/multer.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/verify").post(verify);
router.route("/me").get(isAuthenticated, getMyProfile);
router
  .route("/profile/update")
  .post(isAuthenticated, singleUpload, updateMyProfile);
router
  .route("/profile/update/background")
  .post(isAuthenticated, singleUpload, updateBackgroundImage);
router.route("/user/:id").get(getUserDetails);
router.route("/all/network").get(getAllNetwork);
router.route("/network/create").post(createNetwork);
router.route("/my/network").get(getMyNetwork);
router.route("/my/network/add").post(addUserToNetwork);
router.route("/add/skill").post(isAuthenticated, addSkill);
router.route("/add/education").post(isAuthenticated, addEducation);

export default router;
