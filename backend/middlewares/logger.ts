import { NextFunction, Request, Response } from "express";
import { logger } from "../index";

const middleLogger = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const logLevel = err.logLevel || "error";

  (logger as any)[logLevel](`[${req.method} ${req.url}] - ${err.message}`);

  const responseMessage =
    process.env.NODE_ENV === "development"
      ? err.message
      : "Internal Server Error";

  res.status(err.statusCode || 500).json({ message: responseMessage });
};

export default middleLogger;
