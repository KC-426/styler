import express from "express";

import userAuth from "../middleware/auth.js";
import { contactUs } from "../controllers/contactUsController.js";

const router = express.Router();

router.route("/contact/us").post(contactUs);

export default router;
