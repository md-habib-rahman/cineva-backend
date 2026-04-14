/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { castService } from "./cast.service";


const createCast = async (req: Request, res: Response) => {
	const payload = req.body
	try {
		const result = await castService.createCast(payload)
		res.status(201).json({
			success: true,
			message: "Cast created successfully",
			data: result
		})
	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: "Failed to create cast",
			error: error.message
		})
	}
}

const getAllCasts = async (req: Request, res: Response) => {
	try {
		const result = await castService.getAllCasts();
		res.status(200).json({
			success: true,
			message: "Casts fetched successfully",
			data: result
		})

	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: "Failed to fetch cast",
			error: error.message
		})
	}
}

const deleteCast = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const result = await castService.deleteCast(id as string);
		res.status(200).json({
			success: true,
			message: "Cast deleted successfully",
			data: result
		})

	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: "Failed to delete cast",
			error: error.message
		})
	}

}

const updateCast = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const payload = req.body
		const result = await castService.updateCast(id as string, payload);
		res.status(200).json({
			success: true,
			message: "Cast updated successfully",
			data: result
		})

	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: "Failed to update cast",
			error: error.message
		})
	}

}

export const castController = {
	createCast,
	getAllCasts,
	deleteCast,
	updateCast
}