import { Request, Response } from "express";
import * as userService from "../services/userService";
import jwt from "jsonwebtoken";
import * as mailer from "../util/mailer";
import bcrypt from "bcrypt";
import User from "../models/User";
import * as AWS from "aws-sdk";
import { CustomRequest } from "../types";
import { v4 as uuidv4 } from "uuid";

export const createUser = async (req: CustomRequest, res: Response) => {
  let newUser: any;

  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    req.body.password = passwordHash;
    newUser = await userService.createUser(req.body);
    const token = userService.generateVerificationToken(newUser._id);
    const verificationLink = `http://localhost:5000/api/verify-email?token=${token}`;
    await mailer.sendEmail(
      newUser.email,
      "Email Verification",
      mailer.createVerificationEmail(verificationLink)
    );
    res.status(200).send({
      message:
        "Registration successful! Please check your email to verify your account.",
    });
  } catch (error: any) {
    if (newUser && newUser._id) {
      await userService.deleteUserById(newUser._id);
    }
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res
        .status(400)
        .send({ success: false, message: "Email already exists" });
    }
    res.status(500).send({
      success: false,
      message: "Verify email with Amazon SES",
      error: error,
    });
  }
};

export const verifyEmail = async (req: CustomRequest, res: Response) => {
  const token = req.query.token as string;

  try {
    const verified: any = jwt.verify(token, process.env.JWT_SECRET as string);
    await User.findByIdAndUpdate(verified._id, { isVerified: true });

    res.status(200).redirect("http://localhost:3000/");
  } catch (error: any) {
    res.status(400).send({
      message: "Email verification failed.",
      error: error,
      redirectTo: "http://localhost:3000/error",
    });
  }
};

export const updateUser = async (req: CustomRequest, res: Response) => {
  try {
    if (req.foundUser) {
      const user = await userService.updateUserById(
        req.foundUser._id,
        req.body
      );
      res.status(200).send(user);
    } else {
      res.status(404).send({
        message: "User not found.",
      });
    }
  } catch (error: any) {
    res.status(500).send({
      message: "An error occurred while updating the user.",
      error: error.message,
    });
  }
};

export const uploadToS3 = async (req: CustomRequest, res: Response) => {
  const s3 = new AWS.S3({
    signatureVersion: "v4",
  });

  let file = req.files?.profilePicture;

  if (Array.isArray(file)) {
    file = file[0];
  }

  if (!file) {
    return res.status(400).send({
      message: "No file uploaded",
    });
  }

  const newFileName = `${uuidv4()}_${file.name}`;

  const uploadParams = {
    Bucket: "orchtinimages",
    Key: newFileName,
    Body: file.data,
    ContentType: file.mimetype,
  };
  try {
    const s3Response = await s3.upload(uploadParams).promise();
    console.log("Upload Success", s3Response.Location);
    res.status(200).send({ url: s3Response.Location });
  } catch (error: any) {
    console.error("Error while uploading to S3:", error);
    res.status(500).send({
      message: "Failed to upload image to S3",
      error: error.message,
    });
  }
};

export const deleteFromS3 = async (req: CustomRequest, res: Response) => {
  const s3 = new AWS.S3({
    signatureVersion: "v4",
  });

  const imageUrl = req.body.imageUrl;

  const key = imageUrl.split("orchtinimages.s3.us-east-2.amazonaws.com/")[1];

  const deleteParams = {
    Bucket: "orchtinimages",
    Key: key,
  };

  try {
    await s3.deleteObject(deleteParams).promise();
    res.status(200).send({ message: "Image successfully deleted" });
  } catch (error: any) {
    res.status(500).send({
      message: "Failed to delete image from S3",
      error: error.message,
    });
  }
};

export async function checkUser(req: CustomRequest, res: Response) {
  if (!req.foundUser) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  try {
    const user = await User.findOne({ _id: req.foundUser._id }).select(
      "-password"
    );

    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
