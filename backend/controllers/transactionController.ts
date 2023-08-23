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
