import mongoose, { Schema, Document } from "mongoose";
import { IProduct } from "./Product";
import { IUser } from "./User";

export interface ITransaction extends Document {
  product: IProduct["_id"];
  buyerID: IUser["_id"];
  sellerID: IUser["_id"];
  quantity: number;
  orderNumber: number;
  total: number;
  status: "Pending" | "Fulfilled" | "Canceled";
  transactionDate: Date;
}

const CounterSchema = new Schema({
  _id: String,
  seq: Number,
});
export const Counter = mongoose.model("Counter", CounterSchema);

const TransactionSchema: Schema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  status: { type: String, required: true },
  buyerID: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sellerID: { type: Schema.Types.ObjectId, ref: "User", required: true },
  quantity: { type: Number, required: true },
  orderNumber: { type: Number, unique: true },
  total: { type: Number, required: true },
  transactionDate: { type: Date, default: Date.now },
});

TransactionSchema.pre<ITransaction>("save", async function (next) {
  const doc = this;

  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "transaction" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    if (counter && typeof counter.seq === "number") {
      doc.orderNumber = counter.seq;
    } else {
      throw new Error("Failed to generate an order number.");
    }

    next();
  } catch (error: any) {
    console.error(error);
  }
});

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
