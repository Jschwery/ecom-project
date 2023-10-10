import passport from "passport";
import { NextFunction, Response } from "express";
import * as userService from "../services/userService";
import User, { IUser } from "../models/User";
import bcrypt from "bcrypt";
import { CustomRequest } from "../types";
import dotenv from "dotenv";

dotenv.config();
const isDevelopment = process.env.NODE_ENV === "development";

export const googleAuthCallback = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new Error("User not found"));
  }
  try {
    const user = req.user as IUser;
    const token = userService.generateVerificationToken(user._id as string);
    res.cookie("googleToken", token, {
      httpOnly: true,
      secure: isDevelopment ? false : true,
      sameSite: isDevelopment ? "lax" : "none",
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.redirect(`${process.env.FRONTEND_URL}/`);
  } catch (err) {
    next(err);
  }
};

export const handleLogin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      throw new Error("Email or password is incorrect");
    }

    if (!user.password) {
      throw new Error("User password not found");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      throw new Error("Email or password is incorrect");
    }

    const token = userService.generateVerificationToken(user._id as string);

    const maxAge = req.body.rememberMe
      ? 7 * 24 * 60 * 60 * 1000
      : 12 * 60 * 60 * 1000;

    res
      .cookie("emailToken", token, {
        httpOnly: true,
        secure: isDevelopment ? false : true,
        sameSite: isDevelopment ? "lax" : "none",
        maxAge: maxAge,
      })
      .status(200)
      .send({ message: "Login successful" });
  } catch (error) {
    next(error);
  }
};
