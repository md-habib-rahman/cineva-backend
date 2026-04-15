

import { Cast } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCast = async (payload: Cast): Promise<Cast> => {
	const cast = await prisma.cast.create({
		data: payload
	})
	return cast
}

const getAllCasts = async (): Promise<Cast[]> => {
	const casts = await prisma.cast.findMany()
	return casts
}

const deleteCast = async (id: string): Promise<Cast> => {
	const casts = await prisma.cast.delete({
		where: {
			id
		}
	})
	return casts
}

const updateCast = async (id: string, payload: Cast): Promise<Cast> => {
	const casts = await prisma.cast.update({
		where: {
			id
		},
		data: payload
	})
	return casts
}


export const castService = {
	createCast,
	getAllCasts,
	deleteCast,
	updateCast
}