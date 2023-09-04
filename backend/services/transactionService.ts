import Transaction, { ITransaction } from "../models/Transaction";

export const createTransaction = async (transactionInfo: ITransaction) => {
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
      transactionInfo
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
  try {
    const transactions = await Transaction.find({ sellerID: sellerID });
    return transactions;
  } catch (err) {
    console.error(err);
  }
}
