import express from "express";
import multer from "multer";

import userAuth from "../middleware/auth.js";
import { addBlog, getBlogs } from "../controllers/blogsController.js";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileSize: { limits: 10 * 1024 * 1024 },
});

const router = express.Router();

router.route("/add/blog").post(userAuth, upload.single('image'), addBlog);
router.route("/get/blog").get(userAuth, getBlogs);

export default router;
