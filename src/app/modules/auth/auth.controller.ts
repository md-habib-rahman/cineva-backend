import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import { tokenUtils } from "../../utils/token";

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
	const { accessToken, refreshToken, token, ...rest } = result
	tokenUtils.setAccessTokenCookie(res, accessToken)
	tokenUtils.setRefreshTokenCookie(res, refreshToken)
	tokenUtils.setBetterAuthSessionCookie(res, token)
	sendResponse(res, {
		httpStatus: 200,
		success: true,
		message: "User logged in successfully",
		data: {
			...rest,
			accessToken,
			refreshToken,
			token
		}
	})
})


export const authController = {
	registerUser,
	loginUser
}