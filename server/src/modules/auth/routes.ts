import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { validate } from "../../middleware/validate.js";
import { requireAuth } from "../../middleware/auth.js";
import { rateLimit } from "../../middleware/rate-limit.js";
import {
  forgotPasswordSchema,
  loginSchema,
  logoutSchema,
  refreshSchema,
  registerSchema,
  requestVerifySchema,
  resetPasswordSchema,
  updateProfileSchema,
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
  updateProfileController,
  verifyEmailController
} from "./controller.js";

const router = Router();
const authWriteRateLimit = rateLimit({ scope: "auth-write", windowMs: 60_000, max: 30 });

router.post("/register", authWriteRateLimit, validate(registerSchema), asyncHandler(registerController));

router.post("/login", authWriteRateLimit, validate(loginSchema), asyncHandler(loginController));

router.post("/refresh", authWriteRateLimit, validate(refreshSchema), asyncHandler(refreshController));

router.post("/logout", authWriteRateLimit, validate(logoutSchema), asyncHandler(logoutController));

router.get("/me", requireAuth, asyncHandler(meController));

router.patch("/profile", requireAuth, validate(updateProfileSchema), asyncHandler(updateProfileController));

router.post("/verify/request", authWriteRateLimit, validate(requestVerifySchema), asyncHandler(requestVerifyController));

router.post("/verify", authWriteRateLimit, validate(verifyEmailSchema), asyncHandler(verifyEmailController));

router.post("/password/forgot", authWriteRateLimit, validate(forgotPasswordSchema), asyncHandler(forgotPasswordController));

router.post("/password/reset", authWriteRateLimit, validate(resetPasswordSchema), asyncHandler(resetPasswordController));

export default router;
