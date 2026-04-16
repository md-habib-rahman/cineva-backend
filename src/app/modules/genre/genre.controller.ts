import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { genreService } from "./genre.service";

const createGenre = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body
	const result = await genreService.createGenre(payload)
	sendResponse(res, {
		httpStatus: 201,
		success: true,
		message: "Genre created successfully",
		data: result
	})
})

const updateGenre = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params
	const payload = req.body
	const result = await genreService.updateGenre(id as string, payload)
	sendResponse(res, {
		httpStatus: 200,
		success: true,
		message: "Genre updated successfully",
		data: result
	})
})

const deleteGenre = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params
	const result = await genreService.deleteGenre(id as string)
	sendResponse(res, {
		httpStatus: 200,
		success: true,
		message: "Genre deleted successfully",
		data: result
	})
})

const getGenreById = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params
	const result = await genreService.getGenreById(id as string)
	sendResponse(res, {
		httpStatus: 200,
		success: true,
		message: "Genre retrieved successfully",
		data: result
	})
})

const getAllGenres = catchAsync(async (req: Request, res: Response) => {
	const result = await genreService.getAllGenres()
	sendResponse(res, {
		httpStatus: 200,
		success: true,
		message: "Genres retrieved successfully",
		data: result
	})
})

export const genreController = {
	createGenre,
	updateGenre,
	deleteGenre,
	getGenreById,
	getAllGenres
}