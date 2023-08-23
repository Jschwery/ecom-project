import express from "express";
import * as transactionController from "../controllers/transactionController";

const router = express.Router();

router.post("/transaction", transactionController.createTransaction);

export default router;
