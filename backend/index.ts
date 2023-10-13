import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import transactionRoutes from "./routes/transactionRoutes";
import authRoutes from "./routes/authRoutes";
import passport from "passport";
import session from "express-session";
import usePassport from "./middlewares/passport-config";
import usersRoutes from "./routes/usersRoutes";
import logRoutes from "./routes/logRoutes";
import * as AWS from "aws-sdk";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/productRoutes";
import { Counter } from "./models/Transaction";
import { createLogger, format, transports } from "winston";
import fs from "fs";
import https from "https";
import path from "path";
import middleLogger from "./middlewares/logger";

dotenv.config();
const shouldInitialize = process.env.NODE_ENV === "development";
console.log("should initialize is " + shouldInitialize);

const app = express();
app.use(cookieParser());

app.use("/backend/images", express.static(path.join(__dirname, "images")));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

export const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "orchtin-ecom" },
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

mongoose
  .connect(process.env.MONGODB_URL!)
  .then(async () => {
    logger.info("Database connected!");

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
    cookie: {
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV !== "development" ? "none" : "lax",
      httpOnly: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/api", transactionRoutes);
app.use("/api", productRoutes);
app.use("/api", authRoutes);
app.use("/api", usersRoutes);
app.use("/api", logRoutes);

app.use(middleLogger);

if (!shouldInitialize) {
  console.log("I should not make it here");
  console.log("should initialize is " + shouldInitialize);

  const privateKey = fs.readFileSync(
    "/etc/letsencrypt/live/www.orchtin.online/privkey.pem"
  );
  const certificate = fs.readFileSync(
    "/etc/letsencrypt/live/www.orchtin.online/fullchain.pem"
  );
  const ca = fs.readFileSync(
    "/etc/letsencrypt/live/www.orchtin.online/chain.pem",
    "utf8"
  );

  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca,
    sessionIdContext: "EcomServer1",
  };

  const httpsServer = https.createServer(credentials, app);
  httpsServer.on("error", (error) => {
    logger.error("HTTPS server error:", error);
  });

  httpsServer.listen(443, () => {
    logger.info("HTTPS Server running on port 443");
  });
} else {
  app.listen(5000, () => {
    logger.info("Starting HTTP server...");
    logger.info("Server is running on port 5000");
  });
}
