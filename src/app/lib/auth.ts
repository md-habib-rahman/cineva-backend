import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, userStatus } from "../../generated/prisma/enums";
// If your Prisma file is located elsewhere, you can change the path



export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql", // or "mysql", "postgresql", ...etc
	}),
	emailAndPassword: {
		enabled: true,
	},
	user: {
		additionalFields: {
			role: {
				type: "string",
				required: true,
				defaultValue: Role.USER
			},
			status: {
				type: "string",
				required: true,
				defaultValue: userStatus.ACTIVE
			},
			needPasswordChange: {
				type: "boolean",
				required: true,
				defaultValue: false
			},
			isDeleted: {
				type: "boolean",
				required: true,
				defaultValue: false
			},
			deletedAt: {
				type: "date",
				required: false,
			}

		}
	},
	session: {
		expiresIn: 60 * 60 * 24,
		updateAge: 60 * 60 * 24 * 7,
		cookieCache: {
			enabled: true,
			maxAge: 60 * 60 * 24,
		}

	}
});