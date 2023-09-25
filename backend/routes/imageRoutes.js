import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import {
  myUploads,
  uploadBackgroundPhoto,
  uploadImage,
  uploadProfilePhoto,
} from "../controllers/imageController.js";
import singleUpload from "../middleware/multer.js";

const router = express.Router();

router
  .route("/profile/image/upload")
  .post(isAuthenticated, singleUpload, uploadProfilePhoto);
router
  .route("/background/image/upload")
  .post(isAuthenticated, singleUpload, uploadBackgroundPhoto);
router.route("/image/upload").post(isAuthenticated, singleUpload, uploadImage);
router.route("/my/uploads").get(isAuthenticated, myUploads);

export default router;
