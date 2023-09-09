import express from "express";
import * as transactionController from "../controllers/transactionController";
import { extractTokenAndUser } from "../middlewares/extractToken";

const router = express.Router();

router.post(
  "/transactions",
  extractTokenAndUser,
  transactionController.createTransaction
);
router.put(
  "/transactions/:transactionID",
  transactionController.updateTransaction
);
// router.get(
//   "/transactions/buyer/:buyerID",
//   transactionController.getBuyerTransaction
// );
router.get(
  "/transactions/seller/:sellerID",
  transactionController.getSellerTransaction
);

router.get(
  "/transactions/order/:orderID",
  transactionController.getOrderTransaction
);

export default router;
