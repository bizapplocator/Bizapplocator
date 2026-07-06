import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import streamifier from "streamifier";

if (
  !process.env.CLOUDINARY_NAME ||
  !process.env.CLOUDINARY_KEY ||
  !process.env.CLOUDINARY_SECRET
) {
  throw new Error("Missing Cloudinary environment variables");
}
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME as string,
  api_key: process.env.CLOUDINARY_KEY as string,
  api_secret: process.env.CLOUDINARY_SECRET as string,
});

// Configure Multer to store the file in memory as a Buffer
const upload = multer({ storage: multer.memoryStorage() });

export default upload;
