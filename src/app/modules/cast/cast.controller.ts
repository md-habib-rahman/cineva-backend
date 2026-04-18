import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { castService } from "./cast.service";
import { sendResponse } from "../../shared/sendResponse";



const createCast = catchAsync(async (req: Request, res: Response) => {
	console.log(req.body)
	console.log(req.file)
	const payload = {
		...req.body,
		profileUrl: req.file?.path
	}
	const result = await castService.createCast(payload)
	sendResponse(res, {
		httpStatus: 201,
		success: true,
		message: "Cast created successfully",
		data: result
	})
})



const getAllCasts = catchAsync(async (req: Request, res: Response) => {
	const result = await castService.getAllCasts()
	sendResponse(res, {
		httpStatus: 200,
		success: true,
		message: "Cast fetched successfully",
		data: result
	})
})


const deleteCast = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params
	const result = await castService.deleteCast(id as string)
	sendResponse(res, {
		httpStatus: 200,
		success: true,
		message: "Cast deleted successfully",
		data: result
	})
})

const updateCast = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params
	const payload = req.body
	const result = await castService.updateCast(id as string, payload);
	sendResponse(res, {
		httpStatus: 200,
		success: true,
		message: "Cast updated successfully",
		data: result
	})
})

export const castController = {
	createCast,
	getAllCasts,
	deleteCast,
	updateCast
}