import express from "express";
import * as logController from "../controllers/logController";

const router = express.Router();

router.post("/api/logs", logController.submitLog);

router.get("/api/logs/:userID", logController.getUserLogs);

router.get("/api/logs/:userID/:duration", logController.getUserLogsByDuration);
