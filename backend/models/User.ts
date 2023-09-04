import mongoose, { Schema, Document } from "mongoose";

interface Review {
  review: string;
  reviewer: mongoose.Types.ObjectId;
  rating?: number;
}

export interface IUser extends Document {
  name: string;
  lastName?: string;
  email: string;
  password?: string;
  status?: "active" | "suspended" | "banned";
  role: string;
  wishlist?: Schema.Types.ObjectId[];
  isVerified: boolean;
  billingAddress?: string;
  address?: string;
  googleID?: string;
  productsViewed?: Schema.Types.ObjectId[];
  age?: number;
  reviews?: Review[];
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
  paymentMethods?: [
    {
      type: string;
      details: string;
    }
  ];
  shippingAddresses?: {
    name: string;
    state: string;
    zip: string;
  }[];
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },

    productsViewed: { type: String, required: false },
    status: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
    },
    reviews: [
      {
        reviewer: { type: Schema.Types.ObjectId, ref: "User", required: true },
        review: { type: String },
        rating: { type: Number },
      },
    ],

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
    rating: { type: Number, required: false },
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
    paymentMethods: [
      {
        type: { type: String, required: true },
        details: { type: String, required: true },
      },
    ],
    shippingAddresses: [
      {
        name: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        zip: {
          type: String,
          required: true,
        },
      },
    ],
    billingAddresses: [
      {
        name: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        zip: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
