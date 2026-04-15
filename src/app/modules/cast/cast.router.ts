import { Router } from "express";
import { castController } from "./cast.controller";

const router = Router()

router.post('/', castController.createCast)
router.get('/', castController.getAllCasts)
router.delete('/:id', castController.deleteCast)
router.put('/:id', castController.updateCast)

export const castRouter = router