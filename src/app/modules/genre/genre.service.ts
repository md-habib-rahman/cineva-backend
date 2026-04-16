import { prisma } from "../../lib/prisma";

interface CreateGenrePayload {
	name: string;
}

interface UpdateGenrePayload {
	name: string;
}

const createGenre = async (payload: CreateGenrePayload) => {
	const result = await prisma.genre.create({
		data: payload
	})
	return result
};

const updateGenre = async (id: string, payload: UpdateGenrePayload) => {
	const result = await prisma.genre.update({
		where: { id },
		data: payload
	})
	return result
}

const deleteGenre = async (id: string) => {
	const result = await prisma.genre.delete({
		where: { id }
	})
	return result
}

const getGenreById = async (id: string) => {
	const result = await prisma.genre.findUnique({
		where: { id }
	})
	return result
}

const getAllGenres = async () => {
	const result = await prisma.genre.findMany()
	return result
}

export const genreService = {
	createGenre,
	updateGenre,
	deleteGenre,
	getAllGenres,
	getGenreById
};