import { Response } from "express";

interface IResponseData<T> {
	httpStatus: number;
	success: boolean;
	message: string;
	data?: T;
}
export const sendResponse = <T>(res: Response, responseData: IResponseData<T>) => {
	const { httpStatus, success, message, data } = responseData;
	res.status(httpStatus).json({
		success,
		message,
		data
	});
};