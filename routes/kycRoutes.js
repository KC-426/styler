import express from "express";
import { kycStatus, uploadKYC } from "../controllers/kycController.js";

const router = express.Router();

router.route("/upload/kyc").post(uploadKYC);
router.route("/kyc/status").get(kycStatus);

export default router;
