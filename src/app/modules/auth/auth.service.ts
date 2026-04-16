import { userStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { tokenUtils } from "../../utils/token";

interface RegisterUserPayload {
	name: string;
	email: string;
	password: string;
}
interface ILoginUserPayload {
	email: string;
	password: string;
}

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

	return { data, accessToken, refreshToken };
}

export const authService = {
	registerUser,
	loginUser
}