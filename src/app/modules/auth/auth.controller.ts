import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";

const registerUser = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body

	const result = await authService.registerUser(payload)
	sendResponse(res, {
		httpStatus: 201,
		success: true, message: "User registered successfully",
		data: result
	})
})

const loginUser = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body
	const result = await authService.loginUser(payload)
	sendResponse(res, {
		httpStatus: 200,
		success: true, 
		message: "User logged in successfully",
		data: result
	})
})


export const authController = {
	registerUser,
	loginUser
}