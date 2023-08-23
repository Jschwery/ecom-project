import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import transactionRoutes from "./routes/transactionRoutes";
// import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";
import passport from "passport";
import session from "express-session";
import usePassport from "./middlewares/passport-config";
import User from "./models/User";
import usersRoutes from "./routes/usersRoutes";
import * as AWS from "aws-sdk";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URL!)
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => console.log(err));

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
// app.use("/api", productRoutes);
app.use("/api", authRoutes);
app.use("/api", usersRoutes);

User.deleteMany({})
  .then(() => {
    console.log("done");
  })
  .catch((err) => console.log(err));

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
