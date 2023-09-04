import mongoose, { Schema } from "mongoose";
import { Document } from "mongoose";

export interface IProduct extends Document {
  sellerID: Schema.Types.ObjectId[];
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  imageUrls?: [string];
  reviews: [
    {
      review: string;
      UserID: Schema.Types.ObjectId;
      rating: number;
    }
  ];

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
  reviews: [
    {
      review: { type: String, required: true },
      UserID: { type: Schema.Types.ObjectId, required: true },
      rating: { type: Number, required: false },
    },
  ],
  quantity: { type: Number, required: true },
  imageUrls: { type: [String], required: false },
  tags: { type: [String], required: false },
  creationDate: { type: Date, default: Date.now },
  usersViewed: [{ type: Schema.Types.ObjectId, ref: "User", required: false }],
});

export default mongoose.model<IProduct>("Product", ProductSchema);
