import { Router } from "express";
import { castRouter } from "../modules/cast/cast.router";
import { authRoute } from "../modules/auth/auth.route";
import { genreRoute } from "../modules/genre/genre.route";

const router = Router()

router.use("/auth", authRoute)
router.use("/cast", castRouter)
router.use("/genre", genreRoute)

export const indexRouter = router