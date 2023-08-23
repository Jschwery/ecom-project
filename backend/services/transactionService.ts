import Transaction, { ITransaction } from "../models/Transaction";

export const createTransaction = async (transactionInfo: ITransaction) => {
  const transaction = new Transaction(transactionInfo);
  return await transaction.save();
};
