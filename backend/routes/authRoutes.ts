import express from "express";
import passport from "passport";
import * as userController from "../controllers/userController";
import * as authController from "../controllers/authController";
import { Response } from "express";
import { CustomRequest } from "../types";

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
  console.log("THE SIGNOUT CALLED");

  res.cookie("googleToken", "", {
    expires: new Date(0),
    httpOnly: true,
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
