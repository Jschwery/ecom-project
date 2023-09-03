import { Response } from "express";
import * as transactionService from "../services/transactionService";
import { CustomRequest } from "../types";

export const createTransaction = async (req: CustomRequest, res: Response) => {
  try {
    const result = await transactionService.createTransaction(req.body);
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// export function updateTransaction(req: CustomRequest, res: Response) {
//   throw new Error("Function not implemented.");
// }
// export function getBuyerTransaction(req: CustomRequest, res: Response) {
//   throw new Error("Function not implemented.");
// }

// export function getSellerTransaction(req: CustomRequest, res: Response) {
//   throw new Error("Function not implemented.");
// }

// export function getSellerTransaction(req: CustomRequest, res: Response) {
//   throw new Error("Function not implemented.");
// }
