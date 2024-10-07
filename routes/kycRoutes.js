import express from "express";
import { fetchPartnerKyc, getKycDetails, kycStatus, kycVerification, uploadKyc, } from "../controllers/kycController.js";
import {partnerAuth} from "../middleware/auth.js"

const router = express.Router();

router.route("/upload/kyc").post(partnerAuth, uploadKyc);
router.route("/kyc/status").get(partnerAuth, kycStatus);
router.route("/get/partner/kyc").get(partnerAuth, fetchPartnerKyc);
router.route("/get/kyc/:kycDocId").get(partnerAuth, getKycDetails);
router.route("/kyc/verification").get(partnerAuth, kycVerification);

export default router;
