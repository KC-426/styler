import express from "express";

import userAuth from "../middleware/auth.js";
import { newsletterSignup } from "../controllers/newsletterSignupController.js";

const router = express.Router();

router.route("/newsletter/signup").post(newsletterSignup);

export default router;
