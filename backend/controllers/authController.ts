import passport from "passport";
import { Response } from "express";
import * as userService from "../services/userService";
import User, { IUser } from "../models/User";
import bcrypt from "bcrypt";
import { CustomRequest } from "../types";

export const googleAuthCallback = async (req: CustomRequest, res: Response) => {
  if (!req.user) {
    return res.status(400).send("User not found");
  }
  try {
    const user = req.user as IUser;
    const token = userService.generateVerificationToken(user._id as string);
    res.cookie("googleToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.redirect(`http://localhost:3000/`);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const handleLogin = async (req: CustomRequest, res: Response) => {
  const user = await User.findOne({ email: req.body.email });

  console.log("in handle login");

  console.log(user);

  if (!user) return res.status(400).send("Email or password is incorrect");

  if (!user.password) {
    return res.status(400).send("User password not found");
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Email or password is incorrect");

  const token = userService.generateVerificationToken(user._id as string);
  console.log("token: " + token);

  const maxAge = req.body.rememberMe
    ? 7 * 24 * 60 * 60 * 1000
    : 12 * 60 * 60 * 1000;

  res
    .cookie("emailToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: maxAge,
    })
    .status(200)
    .send({ message: "Login successful" });
};
