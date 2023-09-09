import Transaction, { ITransaction } from "../models/Transaction";
import mongoose from "mongoose";

export const createTransaction = async (transactionInfo: ITransaction) => {
  console.log("heres transaction info: ");
  console.log(transactionInfo);

  const transaction = new Transaction(transactionInfo);
  return await transaction.save();
};

export async function updateTransaction(
  transactionID: string,
  transactionInfo: ITransaction
) {
  try {
    const transactionUpdate = await Transaction.findByIdAndUpdate(
      transactionID,
      transactionInfo,
      { new: true }
    );
    return transactionUpdate;
  } catch (err) {
    console.error(err);
  }
}
export async function getBuyerTransaction(buyerID: string) {
  try {
    const transactions = await Transaction.find({ buyerID: buyerID });
    return transactions;
  } catch (err) {
    console.error(err);
  }
}

export async function getSellerTransaction(sellerID: string) {
  const ObjectId = mongoose.Types.ObjectId;

  try {
    const transactions = await Transaction.find({
      sellerID: new ObjectId(sellerID),
    });

    return transactions;
  } catch (err) {
    console.error(err);
  }
}
