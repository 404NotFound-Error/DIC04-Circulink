import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { validate } from "../../middleware/validate.js";
import { requireAuth } from "../../middleware/auth.js";
import {
  forgotPasswordSchema,
  loginSchema,
  logoutSchema,
  refreshSchema,
  registerSchema,
  requestVerifySchema,
  resetPasswordSchema,
  verifyEmailSchema
} from "./schema.js";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  meController,
  refreshController,
  registerController,
  requestVerifyController,
  resetPasswordController,
  verifyEmailController
} from "./controller.js";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(registerController));

router.post("/login", validate(loginSchema), asyncHandler(loginController));

router.post("/refresh", validate(refreshSchema), asyncHandler(refreshController));

router.post("/logout", validate(logoutSchema), asyncHandler(logoutController));

router.get("/me", requireAuth, asyncHandler(meController));

router.post("/verify/request", validate(requestVerifySchema), asyncHandler(requestVerifyController));

router.post("/verify", validate(verifyEmailSchema), asyncHandler(verifyEmailController));

router.post("/password/forgot", validate(forgotPasswordSchema), asyncHandler(forgotPasswordController));

router.post("/password/reset", validate(resetPasswordSchema), asyncHandler(resetPasswordController));

export default router;
