import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  lastName?: string;
  email: string;
  password?: string;
  status?: "active" | "suspended" | "banned";
  role: string;
  wishlist?: Schema.Types.ObjectId[];
  isVerified: boolean;
  address?: string;
  googleID?: string;
  viewedProducts?: Schema.Types.ObjectId[];
  age?: number;
  sellerName?: string;
  products?: Schema.Types.ObjectId[];
  profilePicture?: string;
  isSeller?: boolean;
  phoneNumber?: string;
  cart?: [
    {
      product: Schema.Types.ObjectId;
      quantity: number;
      dateAdded: Date;
    }
  ];
  orders?: Schema.Types.ObjectId[];
  paymentMethods?: [
    {
      type: string;
      details: string;
    }
  ];
  shippingAddresses?: string[];
  reviews?: [
    {
      product: Schema.Types.ObjectId;
      rating: number;
      comment: string;
      date: Date;
    }
  ];
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    status: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    wishlist: [
      { type: Schema.Types.ObjectId, ref: "Product", required: false },
    ],
    isVerified: { type: Boolean, required: true, default: false },
    address: { type: String, required: false },
    googleID: { type: String, required: false },
    age: { type: Number, required: false },
    sellerName: { type: String, required: false },
    products: [
      { type: Schema.Types.ObjectId, ref: "Product", required: false },
    ],
    profilePicture: {
      type: String,
      required: false,
    },
    isSeller: { type: Boolean, required: false, default: false },
    phoneNumber: { type: String, required: false },
    cart: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        dateAdded: { type: Date, default: Date.now },
      },
    ],
    orders: [{ type: Schema.Types.ObjectId, ref: "Order", required: false }],
    paymentMethods: [
      {
        type: { type: String, required: true },
        details: { type: String, required: true },
      },
    ],
    shippingAddresses: {
      type: [String], 
      required: false,
      default: [] 
  },
    reviews: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
