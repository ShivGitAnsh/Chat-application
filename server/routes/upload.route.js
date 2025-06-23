import express from 'express'
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { uploadImageMiddleware,handleImageUpload } from '../controllers/upload.controller.js';
import { asyncHandler } from '../utilities/asyncHandler.utility.js';

const router = express.Router();

router.post("/image",isAuthenticated, uploadImageMiddleware, asyncHandler(handleImageUpload));

export default router;