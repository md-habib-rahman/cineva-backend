import z from "zod";

const createCastZodSchema = z.object({
	name: z.string("Cast Name is required"),
	intro: z.string("description is required").optional()
})

export const castValidation = {
	createCastZodSchema
}