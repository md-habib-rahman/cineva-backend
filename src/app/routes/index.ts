import { Router } from "express";
import { castRouter } from "../modules/cast/cast.router";
import { authRoute } from "../modules/auth/auth.route";

const router = Router()

router.use("/auth", authRoute)
router.use("/cast", castRouter)

export const indexRouter = router