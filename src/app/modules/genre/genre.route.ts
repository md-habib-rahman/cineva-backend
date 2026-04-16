import { Router } from "express";
import { genreController } from "./genre.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post("/", checkAuth(Role.ADMIN), genreController.createGenre)
router.get("/", genreController.getAllGenres)
router.get("/:id", genreController.getGenreById)
router.put("/:id", checkAuth(Role.ADMIN), genreController.updateGenre)
router.delete("/:id", checkAuth(Role.ADMIN), genreController.deleteGenre)

export const genreRoute = router