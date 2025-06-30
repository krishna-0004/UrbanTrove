import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

export const uploadToCloudinary = async (filePath) => {
    return await cloudinary.uploader.upload(filePath, {
        folder: 'urbantrove/products',
        resource_type: 'image'
    });
};

export const deleteFromCLoudinary = async (publicId) => {
    return await cloudinary.uploader.destroy(publicId);
};