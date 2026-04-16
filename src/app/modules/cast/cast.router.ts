import { Router } from "express";
import { castController } from "./cast.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post('/', checkAuth(Role.ADMIN), castController.createCast)
router.get('/', castController.getAllCasts)
router.delete('/:id', checkAuth(Role.ADMIN), castController.deleteCast)
router.put('/:id', checkAuth(Role.ADMIN), castController.updateCast)

export const castRouter = router