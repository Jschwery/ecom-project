import { NextFunction, Response } from "express";
import { CustomRequest } from "../types";

export async function middleLogger(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  console.log(`Incoming request to ${req.path}`);
  console.log(`request: ${req}`);

  next();
}
