import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import transactionRoutes from "./routes/transactionRoutes";
import authRoutes from "./routes/authRoutes";
import passport from "passport";
import session from "express-session";
import usePassport from "./middlewares/passport-config";
import User from "./models/User";
import usersRoutes from "./routes/usersRoutes";
import * as AWS from "aws-sdk";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/productRoutes";
import { Counter } from "./models/Transaction";
import fs from "fs";
import https from "https";

dotenv.config();
const privateKey = fs.readFileSync("/etc/certs/privkey.pem", "utf8");
const certificate = fs.readFileSync("/etc/certs/fullchain.pem", "utf8");
const ca = fs.readFileSync("/etc/certs/chain.pem", "utf8");
const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};
const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: "https://ecom-project-iota.vercel.app",
    credentials: true,
  })
);

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URL!)
  .then(async () => {
    console.log("Database connected!");

    const existingCounter = await Counter.findById("transaction");
    if (!existingCounter) {
      const transactionCounter = new Counter({ _id: "transaction", seq: 0 });
      await transactionCounter.save();
      console.log("Counter initialized!");
    }
  })
  .catch((err: any) => console.log(err));

usePassport();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION,
});

app.use(
  session({
    secret: `${process.env.JWT_SECRET}`,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/api", transactionRoutes);
app.use("/api", productRoutes);
app.use("/api", authRoutes);
app.use("/api", usersRoutes);

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(443, () => {
  console.log("HTTPS Server running on port 443");
});
// app.listen(process.env.PORT || 5000, () => {
//   console.log(`Server is running on port ${process.env.PORT || 5000}`);
// });
