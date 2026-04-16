import { Router } from "express";
import { genreController } from "./genre.controller";

const router = Router()

router.post("/", genreController.createGenre)
router.get("/", genreController.getAllGenres)
router.get("/:id", genreController.getGenreById)
router.put("/:id", genreController.updateGenre)
router.delete("/:id", genreController.deleteGenre)

export const genreRoute = router