import { Router } from "express";
import {
  registerController,
  verifyEmailController,
  loginController,
  getMeController,
  logoutController,
} from "../controllers/auth.controller.js";
import verifyUser from "./../middlewares/auth.middleware.js";
import {
  loginValidator,
  registerValidator,
} from "../validators/auth.validator.js";

const authRouter = Router();

/**
 * @route   POST /api/auth/register
 * @desc    for register user
 * @access  Public
 * @body    { name, email, password }
 */
authRouter.post("/register", registerValidator, registerController);

/**
 * @route   GET /api/auth/verify-email
 * @desc    for verfiy user by email
 * @access  Public
 * @query   { token }
 */
authRouter.get("/verify-email", verifyEmailController);

/**
 * @route   POST /api/auth/login
 * @desc    for Login User
 * @access  Public
 * @body    { email, password }
 */
authRouter.post("/login", loginValidator, loginController);

/**
 * @route   GET /api/auth/get-me
 * @desc    for getting user details
 * @access  Private
 */
authRouter.get("/get-me", verifyUser, getMeController);

authRouter.get("/logout", verifyUser, logoutController);

export default authRouter;
