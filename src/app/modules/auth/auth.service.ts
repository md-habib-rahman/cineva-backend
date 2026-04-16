
import { userStatus } from "../../../generated/prisma/enums";
import { IRequestUser } from "../../interfaces/user.interface";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
import { envVars } from "../../../config/env";
import { jwtUtils } from "../../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { IChangePasswordPayload, ILoginUserPayload, RegisterUserPayload } from "./auth.interface";



const registerUser = async (payload: RegisterUserPayload) => {
	const { name, email, password } = payload
	const data = await auth.api.signUpEmail({
		body: {
			name,
			email,
			password,

		}
	})

	if (!data.user) {
		throw new Error("User registration failed")
	}

	return data
}

const loginUser = async (payload: ILoginUserPayload) => {

	const { email, password } = payload

	const data = await auth.api.signInEmail({
		body: {
			email,
			password
		}
	})

	if (data.user.status === userStatus.BLOCKED) {
		throw new Error("User is blocked")
	}

	if (data.user.isDeleted || data.user.status === userStatus.DELETED) {
		throw new Error("User is deleted")
	}

	const accessToken = tokenUtils.getAccessToken({
		userId: data.user.id,
		email: data.user.email,
		role: data.user.role,
		name: data.user.name,
		emailverified: data.user.emailVerified,
		status: data.user.status,
		isDeleted: data.user.isDeleted
	})

	const refreshToken = tokenUtils.getRefreshToken({
		userId: data.user.id,
		email: data.user.email,
		role: data.user.role,
		name: data.user.name,
		emailverified: data.user.emailVerified,
		status: data.user.status,
		isDeleted: data.user.isDeleted
	})

	return { data, accessToken, refreshToken, token: data.token };
}

const getMe = async (user: IRequestUser) => {
	const isUserExists = await prisma.user.findUnique({
		where: {
			id: user.userId
		}
	})

	if (!isUserExists) {
		throw new Error("User not found")
	}

	return isUserExists
}

const getNewToken = async (refreshToken: string, sessionToken: string) => {

	const isSessionValid = await prisma.session.findFirst({
		where: {
			token: sessionToken,
			expiresAt: {
				gt: new Date()
			}
		},
		include: {
			user: true
		}
	})

	if (!isSessionValid) {
		throw new Error("Invalid session")
	}

	const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET)


	if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
		throw new Error("Invalid refresh token")
	}

	const data = verifiedRefreshToken.data as JwtPayload
	console.log(data)
	const newAccessToken = tokenUtils.getAccessToken({
		userId: data.userId,
		email: data.email,
		role: data.role,
		name: data.name,
		emailverified: data.emailVerified,
		status: data.status,
		isDeleted: data.isDeleted
	})

	const newRefreshToken = tokenUtils.getRefreshToken({
		userId: data.userId,
		email: data.email,
		role: data.role,
		name: data.name,
		emailverified: data.emailVerified,
		status: data.status,
		isDeleted: data.isDeleted
	})

	const { token } = await prisma.session.update({
		where: {
			token: sessionToken
		},
		data: {
			token: sessionToken,
			expiresAt: new Date(Date.now() + 60 * 60 * 24 * 1000),
			updatedAt: new Date()
		}
	})

	return { accessToken: newAccessToken, refreshToken: newRefreshToken, sessionToken: token }

}

const changePassword = async (payload: IChangePasswordPayload, sessionToken: string) => {
	const session = await auth.api.getSession({
		headers: new Headers({
			Authorization: `Bearer ${sessionToken}`
		})
	})

	if (!session) {
		throw new Error("Invalid session token")
	}

	const { oldPassword, newPassword } = payload

	const result = await auth.api.changePassword({
		body: {
			currentPassword: oldPassword,
			newPassword,
			revokeOtherSessions: true
		},
		headers: new Headers({
			Authorization: `Bearer ${sessionToken}`
		})
	})

	const accessToken = tokenUtils.getAccessToken({
		userId: session.user.id,
		email: session.user.email,
		role: session.user.role,
		name: session.user.name,
		emailverified: session.user.emailVerified,
		status: session.user.status,
		isDeleted: session.user.isDeleted
	})

	const refreshToken = tokenUtils.getRefreshToken({
		userId: session.user.id,
		email: session.user.email,
		role: session.user.role,
		name: session.user.name,
		emailverified: session.user.emailVerified,
		status: session.user.status,
		isDeleted: session.user.isDeleted
	})


	return { ...result, accessToken, refreshToken }

}


export const authService = {
	registerUser,
	loginUser,
	getMe,
	getNewToken,
	changePassword
}