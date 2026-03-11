import { Router } from "express";
import { registerController } from "../controllers/auth.controller.js";
import { registerValidator } from "../validators/auth.validator.js";

const authRouter = Router();

/**
 * @route   POST /api/auth/register
 * @desc    for register user
 * @access  Public
 * @body    { name, email, password }
 */
authRouter.post("/register", registerValidator, registerController);

export default authRouter;
