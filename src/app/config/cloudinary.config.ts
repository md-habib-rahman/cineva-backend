import { v2 as cloudinary, UploadApiResponse } from "cloudinary"
import { envVars } from "./env"
import AppError from "../errorHelpers/AppError";
import status from "http-status";



cloudinary.config({
	cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
	api_key: envVars.CLOUDINARY_API_KEY,
	api_secret: envVars.CLOUDINARY_API_SECRET
})

export const deleteFileFromCloudinary = async (url: string) => {
	try {
		const regex = /\/upload\/(?:v\d+\/)?(.+?)\.[a-zA-Z0-9]+$/;
		const match = url.match(regex)

		if (match && match[1]) {
			const publicId = match[1];
			await cloudinary.uploader.destroy(publicId, {
				resource_type: "image"
			})

			console.log(`File ${publicId} deleted form cloudinary`)
		}
	} catch (err) {
		console.log("Error deleting file from cloudinary: ", err)
		throw new AppError(status.INTERNAL_SERVER_ERROR, "failed to delete file from cloudinary")
	}
}

export const ManualUploadToCloudinary = async (buffer: Buffer, fileName: string): Promise<UploadApiResponse> => {
	if (!buffer || !fileName) {
		throw new AppError(status.BAD_REQUEST, "File buffer and file name are required for upload");
	}


	const extension = fileName.split(".").pop()?.toLowerCase();
	const fileNameWithoutExtension = fileName
		.split('.')
		.slice(0, -1)
		.join(".")
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/g, "");

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

	return new Promise((resolve, reject) => {
		cloudinary.uploader.upload_stream({
			resource_type: "auto",
			public_id: `cineva/${folder}/${uniqueName}`,
			folder: `cineva/${folder}`
		}, (error, result) => {
			if (error) {
				return reject(new AppError(status.INTERNAL_SERVER_ERROR, "Failed to upload file to Cloudinary"))
			}
			resolve(result as UploadApiResponse)
		})

	})
}



export const cloudinaryUpload = cloudinary