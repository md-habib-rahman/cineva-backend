import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import { tokenUtils } from "../../utils/token";
import { cookieUtils } from "../../utils/cookie";
import { envVars } from "../../../config/env";
import { auth } from "../../lib/auth";



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

const changePassword = catchAsync(
	async (req: Request, res: Response) => {
		const payload = req.body
		const betterAuthSessionToken = req.cookies["better-auth.session_token"]
		const result = await authService.changePassword(payload, betterAuthSessionToken)

		const { accessToken, refreshToken, token } = result

		tokenUtils.setAccessTokenCookie(res, accessToken)
		tokenUtils.setRefreshTokenCookie(res, refreshToken)
		tokenUtils.setBetterAuthSessionCookie(res, token as string)

		sendResponse(res, {
			httpStatus: 200,
			success: true,
			message: "Password changed successfully!",
			data: result
		})
	}
)

const logoutUser = catchAsync(async (req: Request, res: Response) => {
	const betterAuthSessionToken = req.cookies["better-auth.session_token"]
	const result = await authService.logoutUser(betterAuthSessionToken)

	cookieUtils.clearCookie(res, 'accessToken', {
		httpOnly: true,
		secure: true,
		sameSite: "none"
	})
	cookieUtils.clearCookie(res, 'refreshToken', {
		httpOnly: true,
		secure: true,
		sameSite: "none"
	})
	cookieUtils.clearCookie(res, "better-auth.session_token", {
		httpOnly: true,
		secure: true,
		sameSite: "none"
	})

	sendResponse(res, {
		httpStatus: 200,
		success: true,
		message: "User logged out successfully",
		data: result
	})
})

const verifyEmail = catchAsync(
	async (req: Request, res: Response) => {
		const { email, otp } = req.body
		await authService.verifyEmail(email, otp)

		sendResponse(res, {
			httpStatus: 200,
			success: true,
			message: "Email verified successfully",
			// data: result
		})
	}
)

const forgetPassword = catchAsync(
	async (req: Request, res: Response) => {
		const { email } = req.body
		await authService.forgetPassword(email)

		sendResponse(res, {
			httpStatus: 200,
			success: true,
			message: "Password reset OTP sent to email successfully"
		})
	}
)

const resetPassword = catchAsync(
	async (req: Request, res: Response) => {
		const { email, otp, newPassword } = req.body
		await authService.resetPassword(email, otp, newPassword)

		sendResponse(res, {
			httpStatus: 200,
			success: true,
			message: "Password reset successfully"
		})
	}
)

const googleLogin = catchAsync(async (req: Request, res: Response) => {
	const redirectPath = req.query.redirect || "/dashboard"

	const encodedRedirectPath = encodeURIComponent(redirectPath as string)

	const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`

	res.render("googleRedirect", {
		callbackURL,
		betterAuthUrl: envVars.BETTER_AUTH_URL,
	})
})

const googleLoginSuccess = catchAsync(async (req: Request, res: Response) => {
	const redirectPath = req.query.redirect || "/"

	const sessionToken = req.cookies["better-auth.session_token"]

	if (!sessionToken) {
		return res.redirect(`${envVars.APP_URL}/login?error=oauth_failed`)
	}

	const session = await auth.api.getSession({
		headers: {
			"cookie": `better-auth.session_token=${sessionToken}`
		}
	})

	if (session && !session.user) {
		res.redirect(`${envVars.APP_URL}/login?error=no_user_found`)
	}

	const result = await authService.googleLoginSuccess(session)

	const { accessToken, refreshToken } = result
	tokenUtils.setAccessTokenCookie(res, accessToken)
	tokenUtils.setRefreshTokenCookie(res, refreshToken)

	const isValidRedirectPath = redirectPath.toString().startsWith("/") && !redirectPath.toString().startsWith("//")

	const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";

	res.redirect(`${envVars.APP_URL}${finalRedirectPath}`)
})

const handleOauthError = catchAsync(async (req: Request, res: Response) => {

	const error = req.query.error as string || "oath_failed"

	res.redirect(`${envVars.APP_URL}/login?error=${error}`)
})



export const authController = {
	registerUser,
	loginUser,
	getMe,
	getNewToken,
	changePassword,
	logoutUser,
	verifyEmail,
	resetPassword,
	forgetPassword,
	googleLogin,
	googleLoginSuccess,
	handleOauthError
}