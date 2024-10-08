import express from "express";
import {partnerAuth} from "../middleware/auth.js"
import { createMembershipPayment, getpaymentstatus, paymentFailed, verifyPayment } from "../controllers/partnerMembership.js";

const router = express.Router();

router.route("/membership/payment").post(partnerAuth, createMembershipPayment);
router.route("/verify/payment").post(partnerAuth, verifyPayment);
router.route("/membership/payment/failed").post(partnerAuth, paymentFailed);
router.route("/get/payment/status/:partnerId").get(partnerAuth, getpaymentstatus);

export default router;
