import express from "express";
import passport from "passport";
import * as userController from "../controllers/userController";
import * as authController from "../controllers/authController";
import { Response } from "express";
import { CustomRequest } from "../types";
import dotenv from "dotenv";

dotenv.config();
const isDevelopment = process.env.NODE_ENV === "development";
const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login-failure" }),
  authController.googleAuthCallback
);

router.get("/login-failure", (req, res) => {
  res.send("Login failed. Please try again.");
});

router.post("/login", authController.handleLogin);

router.post("/signout", (req: CustomRequest, res: Response) => {
  res.cookie("googleToken", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: isDevelopment ? false : true,
    sameSite: isDevelopment ? "lax" : "none",
    path: "/",
  });
  res.cookie("emailToken", "", {
    expires: new Date(0),
    httpOnly: true,
    path: "/",
  });
  res.status(200).send({ message: "Signed out successfully" });
});

router.post("/register-user", userController.createUser);
router.get("/verify-email", userController.verifyEmail);

export default router;
