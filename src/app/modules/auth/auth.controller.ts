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
	// console.log(accessToken, refreshToken, token)
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

const getMe = catchAsync(async (req: Request, res: Response) => {
	const user = req.user;
	// console.log(user, req.user)
	const result = await authService.getMe(user)
	sendResponse(res, {
		httpStatus: 200,
		success: true,
		message: "User data retrieved successfully",
		data: result
	})
})

const getNewToken = catchAsync(async (req: Request, res: Response) => {
	const refreshToken = req.cookies.refreshToken
	const betterAuthSessionToken = req.cookies["better-auth.session_token"]

	if (!refreshToken) {
		throw new Error("No refresh token provided")
	}
	
	const result = await authService.getNewToken(refreshToken, betterAuthSessionToken)

	const { accessToken, refreshToken: newRefreshToken, sessionToken } = result
	tokenUtils.setAccessTokenCookie(res, accessToken)
	tokenUtils.setRefreshTokenCookie(res, newRefreshToken)
	tokenUtils.setBetterAuthSessionCookie(res, sessionToken)

	sendResponse(res, {
		httpStatus: 200,
		success: true, message: "New access token generated successfully",
		data: {
			accessToken,
			refreshToken: newRefreshToken,
			sessionToken
		}
	})
})



export const authController = {
	registerUser,
	loginUser,
	getMe,
	getNewToken
}