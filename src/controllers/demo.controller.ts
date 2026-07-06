import { Request, Response } from "express";

export const publicRoute = (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Public endpoint",
  });
};

export const protectedRoute = (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Protected endpoint",
  });
};

export const slowRoute = async (_req: Request, res: Response) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  res.json({
    success: true,
    message: "Slow endpoint",
  });
};

export const burstRoute = (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Burst endpoint",
  });
};