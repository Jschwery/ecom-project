import mongoose, { Schema, Document } from "mongoose";
import { IProduct } from "./Product";
import { IUser } from "./User";

export interface ITransaction extends Document {
  product: IProduct["_id"];
  buyer: IUser["_id"];
  seller: IUser["_id"];
  quantity: number;
  total: number;
  transactionDate: Date;
}

const TransactionSchema: Schema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
  transactionDate: { type: Date, default: Date.now },
});

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
