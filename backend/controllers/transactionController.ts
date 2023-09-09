import { Response } from "express";
import * as transactionService from "../services/transactionService";
import { CustomRequest } from "../types";
import Transaction from "../models/Transaction";

export const createTransaction = async (req: CustomRequest, res: Response) => {
  try {
    console.log("create transaction");
    console.log(req.body);

    const result = await transactionService.createTransaction(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export async function updateTransaction(req: CustomRequest, res: Response) {
  try {
    const result = await transactionService.updateTransaction(
      req.params.transactionID,
      req.body
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getBuyerTransaction(req: CustomRequest, res: Response) {
  try {
    const result = await transactionService.getBuyerTransaction(
      req.params.buyerID
    );
    if (result && result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Transactions not found for the buyer" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSellerTransaction(req: CustomRequest, res: Response) {
  console.log("Entered getSellerTransaction");
  console.log("Seller ID:", req.params.sellerID);

  try {
    const result = await transactionService.getSellerTransaction(
      req.params.sellerID
    );
    console.log("Transactions fetched: ", result);

    if (result && result.length > 0) {
      res.status(200).json(result);
    } else {
      res
        .status(404)
        .json({ message: "Transactions not found for the seller" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getOrderTransaction(req: CustomRequest, res: Response) {
  const orderID = req.params.orderID;
  try {
    const transactionFound = await Transaction.findById(orderID);
    if (transactionFound) {
      res.status(200).json(transactionFound);
    } else {
      res
        .status(404)
        .json({ message: "Transactions not found for the seller" });
    }
  } catch (error) {
    console.error(error);
  }
}
