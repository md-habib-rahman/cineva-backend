/* eslint-disable no-useless-escape */
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import multer from "multer";

const storage = new CloudinaryStorage({
	cloudinary: cloudinaryUpload,
	params: async (req, file) => {
		const originalName = file.originalname;
		const extension = originalName.split(".").pop()?.toLowerCase();
		const fileNameWithoutExtension = originalName
			.split('.')
			.slice(0, -1)
			.join(".")
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9\-]/g, "");

		const uniqueName =
			Math.random().toString(36).substring(2)
			+ "-"
			+ Date.now()
			+ "-"
			+ fileNameWithoutExtension

		const imageExt = ["webp", "avif", "jpeg", "jpg", "png"];
		const videoExt = ["mp4", "m3u8", "m4s", "ts"];

		const folder =
			imageExt.includes(extension as string) ? "images" :
				videoExt.includes(extension as string) ? "videos" :
					"others";

		return {
			folder: `cineva/${folder}`,
			public_id: uniqueName,
			resource_type: "auto"
		}
	}
})

export const multerUpload = multer({ storage })