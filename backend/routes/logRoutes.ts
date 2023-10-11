import express from "express";
import * as logController from "../controllers/logController";

const router = express.Router();

router.post("/logs", logController.submitLog);

router.get("/logs/:userID", logController.getUserLogs);

router.get("/logs/:userID/:duration", logController.getUserLogsByDuration);

export default router;
