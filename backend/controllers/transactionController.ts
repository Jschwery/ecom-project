import { NextFunction, Response } from "express";
import * as transactionService from "../services/transactionService";
import { CustomRequest } from "../types";
import Transaction from "../models/Transaction";

export const createTransaction = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await transactionService.createTransaction(req.body);
    res.status(201).json(result);
  } catch (error) {
    next({
      message: "Failed to create transaction",
      error,
      statusCode: 500,
      logLevel: "error",
    });
  }
};

export async function updateTransaction(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await transactionService.updateTransaction(
      req.params.transactionID,
      req.body
    );
    res.status(200).json(result);
  } catch (error) {
    next({
      message: "Failed to update transaction",
      error,
      statusCode: 500,
      logLevel: "error",
    });
  }
}

export async function getBuyerTransaction(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await transactionService.getBuyerTransaction(
      req.params.buyerID
    );
    if (result && result.length > 0) {
      res.status(200).json(result);
    } else {
      next({
        message: "Transactions not found for the buyer",
        statusCode: 404,
        logLevel: "warn",
      });
    }
  } catch (error) {
    next({
      message: "Error fetching buyer transactions",
      error,
      statusCode: 500,
      logLevel: "error",
    });
  }
}

export async function getSellerTransaction(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await transactionService.getSellerTransaction(
      req.params.sellerID
    );
    console.log("Transactions fetched: ", result);

    if (result && result.length > 0) {
      res.status(200).json(result);
    } else {
      next({
        message: "Transactions not found for the seller",
        statusCode: 404,
        logLevel: "warn",
      });
    }
  } catch (error) {
    next({
      message: "Error fetching seller transactions",
      error,
      statusCode: 500,
      logLevel: "error",
    });
  }
}

export async function getOrderTransaction(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const orderID = req.params.orderID;
  try {
    const transactionFound = await Transaction.findById(orderID);
    if (transactionFound) {
      res.status(200).json(transactionFound);
    } else {
      next({
        message: "Transaction not found for the order",
        statusCode: 404,
        logLevel: "warn",
      });
    }
  } catch (error) {
    next({
      message: "Error fetching order transaction",
      error,
      statusCode: 500,
      logLevel: "error",
    });
  }
}
