import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {

	NODE_ENV: string;
	PORT: string;
	DATABASE_URL: string;
	BETTER_AUTH_SECRET: string;
	BETTER_AUTH_URL: string;
	ACCESS_TOKEN_SECRET: string;
	REFRESH_TOKEN_SECRET: string;
	ACCESS_TOKEN_EXPIRES_IN: string;
	REFRESH_TOKEN_EXPIRES_IN: string;
	APP_PASS: string,
	APP_USER: string,
	SMTP_PORT: string
	SMTP_HOST: string,
	CLIENT_ID: string,
	CLIENT_SECRET: string,
	GOOGLE_CALLBACK_URL: string,
	APP_URL: string,
}

const loadEnvVariables = (): EnvConfig => {

	const requiredEnvVars = [
		"NODE_ENV",
		"PORT",
		"DATABASE_URL",
		"BETTER_AUTH_SECRET",
		"BETTER_AUTH_URL",
		"ACCESS_TOKEN_SECRET",
		"REFRESH_TOKEN_SECRET",
		"ACCESS_TOKEN_EXPIRES_IN",
		"REFRESH_TOKEN_EXPIRES_IN",
		"APP_PASS",
		"APP_USER",
		"SMTP_PORT",
		"SMTP_HOST",
		"CLIENT_ID",
		"CLIENT_SECRET",
		"GOOGLE_CALLBACK_URL",
		"APP_URL",
	];


	requiredEnvVars.forEach((envVar) => {
		if (!process.env[envVar]) {
			throw new Error(`Environment variable ${envVar} is not set`);
		}
	});

	return {
		NODE_ENV: process.env.NODE_ENV as string,
		PORT: process.env.PORT as string,
		DATABASE_URL: process.env.DATABASE_URL as string,
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
		BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
		ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
		REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
		ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
		REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
		APP_PASS: process.env.APP_PASS as string,
		APP_USER: process.env.APP_USER as string,
		SMTP_PORT: process.env.SMTP_PORT as string,
		SMTP_HOST: process.env.SMTP_HOST as string,
		CLIENT_ID: process.env.CLIENT_ID as string,
		CLIENT_SECRET: process.env.CLIENT_SECRET as string,
		GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
		APP_URL: process.env.APP_URL as string,
	}
}

export const envVars = loadEnvVariables()