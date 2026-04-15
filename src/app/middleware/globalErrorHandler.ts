/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	if (envVars.NODE_ENV === "development") {
		console.error(err);
	}
	res.status(500).json({
		success: false,
		message: "Internal Server Error",
		error: err.message,
	})
}