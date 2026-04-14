import { Router } from "express";
import { castRouter } from "../../modules/cast/cast.router";

const router = Router()

router.use("/cast", castRouter)

export const indexRouter = router