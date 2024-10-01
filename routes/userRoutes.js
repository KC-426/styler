import express from "express";
import multer from "multer";

import userAuth from "../middleware/auth.js";
import {
  completeUserProfile,
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
router.route("/verify/email/:userId").post(userAuth, verifyEmail);

export default router;
