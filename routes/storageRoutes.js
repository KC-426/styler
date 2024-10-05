import express from 'express'
import { getUploadUrl } from '../controllers/storageController.js';

const router = express.Router()

router.post("/storage/upload", getUploadUrl);


export default router