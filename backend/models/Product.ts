import mongoose, { Schema } from "mongoose";
import { IUser } from "./User";
import { Document } from "mongoose";

export interface IProduct extends Document {
  _id: Schema.Types.ObjectId;
  sellerID: IUser["_id"];
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  imageUrls?: [string];
  tags?: [string];
  usersViewed?: Schema.Types.ObjectId[];
  creationDate: Date;
}

const ProductSchema: Schema = new Schema({
  sellerID: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  imageUrls: { type: [String], required: false },
  tags: { type: [String], required: false },
  creationDate: { type: Date, default: Date.now },
  usersViewed: [{ type: Schema.Types.ObjectId, ref: "User", required: false }],
});

export default mongoose.model<IProduct>("Product", ProductSchema);
