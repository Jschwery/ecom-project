import { CustomRequest } from "../types";
import { NextFunction, Response } from "express";
import dotenv from "dotenv";
import ErrorLog from "../models/Error";
import mongoose from "mongoose";

dotenv.config();
export async function submitLog(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const error = req.body;
  try {
    const log = new ErrorLog(error);
    const newError = await log.save();
    res.status(200).json(newError);
  } catch (err: any) {
    next(err);
  }
}

export async function getUserLogs(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const { userID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userID)) {
    return res.status(400).send({ message: "Invalid user ID" });
  }
  try {
    const logs = await ErrorLog.find({ userID: userID })
      .sort({ timestamp: -1 })
      .exec();
    if (!logs.length) {
      return res.status(200).json([]);
    }
    res.status(200).json(logs);
  } catch (error: any) {
    next(error);
  }
}

export async function getUserLogsByDuration(req: CustomRequest, res: Response) {
  const { userID } = req.params;
  const { duration } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userID)) {
    return res.status(400).send({ message: "Invalid user ID" });
  }

  let startDate = new Date();
  switch (duration) {
    case "HOUR":
      startDate.setHours(startDate.getHours() - 1);
      break;
    case "DAY":
      startDate.setDate(startDate.getDate() - 1);
      break;
    case "WEEK":
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "MONTH":
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    default:
      return res.status(400).send({ message: "Invalid duration type" });
  }

  try {
    const logs = await ErrorLog.find({
      userID: userID,
      timestamp: { $gte: startDate },
    })
      .sort({ timestamp: -1 })
      .exec();

    if (!logs.length) {
      return res.status(200).json([]);
    }

    res.status(200).json(logs);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}
