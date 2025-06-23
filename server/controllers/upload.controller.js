// controllers/upload.controller.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "chat-app", 
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
  },
});

const upload = multer({ storage });

export const uploadImageMiddleware = upload.single("image");

export const handleImageUpload = (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ success: false, error: "Image upload failed" });
  }

  res.status(200).json({
    success: true,
    imageUrl: req.file.path, 
  });
};
