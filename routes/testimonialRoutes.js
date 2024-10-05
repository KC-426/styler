import express from "express";

import {userAuth} from "../middleware/auth.js";
import { addTestimonial, getTestimonial } from "../controllers/testimonialController.js";

const router = express.Router();

router.route("/add/testimonial").post(userAuth, addTestimonial);
router.route("/get/testimonial").get(getTestimonial);


export default router;
