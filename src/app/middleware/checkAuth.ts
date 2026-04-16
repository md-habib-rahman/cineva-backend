import { NextFunction, Request, Response } from "express";
import { cookieUtils } from "../utils/cookie";
import { jwtUtils } from "../utils/jwt";
import { envVars } from "../../config/env";
import { Role, userStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";


export const checkAuth = (...authRoles: Role[]) => async (req: Request, res: Response, next: NextFunction) => {
	try {

		const sessionToken = cookieUtils.getCookie(req, "better-auth.session_token")

		if (!sessionToken) {
			throw new Error("No Session Token Found, Unauthorized")
		}

		if (sessionToken) {
			const sessionExists = await prisma.session.findFirst({
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
			if (sessionExists && sessionExists.user) {
				const user = sessionExists.user
				const now = new Date()
				const expiresAt = new Date(sessionExists.expiresAt)
				const createdAt = new Date(sessionExists.createdAt)

				const sessionLifeTime = expiresAt.getTime() - createdAt.getTime()
				const timeleft = expiresAt.getTime() - now.getTime()
				const percentRemaining = (timeleft / sessionLifeTime) * 100
				if (percentRemaining < 20) {
					res.setHeader("X-Session-Refresh", "true")
					res.setHeader("X-Session-Expires-At", expiresAt.toISOString())
					res.setHeader("X-Time-Remaining", timeleft.toString())
					console.log("Session Expiring Soon!")
				}
				if (user.status === userStatus.BLOCKED || user.status === userStatus.DELETED) {
					throw new Error("User is blocked or deleted")
				}

				if (user.isDeleted) {
					throw new Error("UNAUTHORIZED: User is deleted")
				}

				console.log(user)

				if (authRoles.length > 0 && !authRoles.includes(user.role)) {
					throw new Error("Forbidden: Insufficient permissions")
				}
			}
		}

		const accessToken = cookieUtils.getCookie(req, "accessToken")		

		if (!accessToken) {
			throw new Error("Unauthorized")
		}

		const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);

		if (!verifiedToken.success) {
			throw new Error("Invalid token")
		}
		console.log(verifiedToken.data?.role)
		if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data?.role as Role)) {
			throw new Error("Forbidden: Insufficient permissions")
		}

		next();
	} catch (error) {
		next(error)
	}
}
