import { Request, Response } from "express";
import {
  getCurrentUser,
  loginUser,
  logoutSession,
  refreshSession,
  registerUser,
  requestEmailVerification,
  requestPasswordReset,
  resetPassword,
  updateUserProfile,
  verifyEmailToken
} from "./service.js";

export const registerController = async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  res.status(201).json(result);
};

export const loginController = async (req: Request, res: Response) => {
  const result = await loginUser(req.body.email, req.body.password);
  res.json(result);
};

export const refreshController = async (req: Request, res: Response) => {
  const result = await refreshSession(req.body.refreshToken);
  res.json(result);
};

export const logoutController = async (req: Request, res: Response) => {
  await logoutSession(req.body.refreshToken);
  res.status(204).send();
};

export const meController = async (req: Request, res: Response) => {
  const user = await getCurrentUser(req.user!.id);
  res.json({ user });
};

export const requestVerifyController = async (req: Request, res: Response) => {
  const result = await requestEmailVerification(req.body.email);
  res.json({ data: result });
};

export const verifyEmailController = async (req: Request, res: Response) => {
  await verifyEmailToken(req.body.token);
  res.status(204).send();
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  const result = await requestPasswordReset(req.body.email);
  res.json({ data: result });
};

export const resetPasswordController = async (req: Request, res: Response) => {
  await resetPassword(req.body.token, req.body.password);
  res.status(204).send();
};

export const updateProfileController = async (req: Request, res: Response) => {
  const user = await updateUserProfile(req.user!.id, req.body);
  res.json({ data: user });
};
