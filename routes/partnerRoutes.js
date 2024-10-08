import express from "express";
// import multer from "multer";

import {partnerAuth} from "../middleware/auth.js";
import { partnerLogin, partnerSignup, sendOtp, verifyEmail, changepassword, completePartnerProfile, getAllPartners } from "../controllers/partnerController.js";


// const storage = multer.memoryStorage();
// const upload = multer({
//   storage,
//   fileSize: { limits: 10 * 1024 * 1024 },
// });

const router = express.Router();

router.route("/partner/signup").post(partnerSignup);
router.route("/partner/login").post(partnerLogin);
router.route("/complete/partner/profile/:partnerId").put(partnerAuth, completePartnerProfile);
router.route("/get/all/partners").get(partnerAuth, getAllPartners);
router.route("/verify/partner/email").post(partnerAuth, verifyEmail);
router.route("/send/partner/otp").post(partnerAuth, sendOtp);
router.route("/change/partner/password").patch(partnerAuth, changepassword);




export default router;
