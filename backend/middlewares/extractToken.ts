import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { CustomRequest } from "../types";

export async function extractTokenAndUser(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  let token;

  if (req.cookies.googleToken) {
    token = req.cookies.googleToken;
  } else if (req.cookies.emailToken) {
    token = req.cookies.emailToken;
  }

  if (!token) {
    return res.status(400).send("No token found!");
  }

  try {
    const decodedPayload: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );
    const userId = decodedPayload._id;

    const user = await User.findById(userId);

    if (user) {
      req.foundUser = user;
      next();
    } else {
      return res.status(404).send("User not found.");
    }
  } catch (err) {
    return res.status(401).send("Unauthorized");
  }
}
