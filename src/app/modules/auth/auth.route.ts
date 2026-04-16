import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/me", checkAuth(Role.ADMIN, Role.USER), authController.getMe)
router.post("/refresh-token", authController.getNewToken)

export const authRoute = router;