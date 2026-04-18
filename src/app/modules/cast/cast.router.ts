import { Router } from "express";
import { castController } from "./cast.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middleware/validateRequest";
import { castValidation } from "./cast.validation";

const router = Router()

router.post('/',
	// checkAuth(Role.ADMIN),
	multerUpload.single("file"),
	validateRequest(castValidation.createCastZodSchema),
	castController.createCast)
router.get('/', castController.getAllCasts)
router.delete('/:id', checkAuth(Role.ADMIN), castController.deleteCast)
router.put('/:id', checkAuth(Role.ADMIN), castController.updateCast)

export const castRouter = router