import express from "express";
import multer from "multer";

import {userAuth} from "../middleware/auth.js";
import {
  changepassword,
  completeUserProfile,
  sendOtp,
  userLogin,
  userSignup,
  verifyEmail,
} from "../controllers/userController.js";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileSize: { limits: 10 * 1024 * 1024 },
});

const router = express.Router();

router.route("/user/signup").post(userSignup);
router.route("/user/login").post(userLogin);
router
  .route("/complete/user/profile/:userId")
  .put(upload.single("image"), userAuth, completeUserProfile);
router.route("/verify/email").post(userAuth, verifyEmail);
router.route("/send/otp").post(userAuth, sendOtp);
router.route("/change/password").patch(userAuth, changepassword);



export default router;
