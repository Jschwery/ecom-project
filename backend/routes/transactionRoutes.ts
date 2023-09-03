import express from "express";
import * as transactionController from "../controllers/transactionController";

const router = express.Router();

router.post("/transactions", transactionController.createTransaction);
router.put(
  "/transactions/:transactionID",
  transactionController.updateTransaction
);
router.get(
  "/transactions/buyer/:buyerID",
  transactionController.getBuyerTransaction
);
router.get(
  "/transactions/seller/:sellerID",
  transactionController.getSellerTransaction
);

export default router;
