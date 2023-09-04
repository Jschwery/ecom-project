import "react-dom";

declare module "*.jpeg";
declare module "*.png";

export interface User {
  _id: string;
  name: string;
  lastName?: string;
  email: string;
  password?: string;
  status?: "active" | "suspended" | "banned";
  role: string;
  wishlist?: string[];
  isVerified: boolean;
  address?: string;
  googleID?: string;
  age?: number;
  sellerName?: string;
  products?: Product[];
  profilePicture?: string;
  isSeller?: boolean;
  reviews?: {
    review: string;
    reviewer?: string;
    rating?: number;
  }[];
  phoneNumber?: string;
  cart?: {
    product: string;
    quantity: number;
    dateAdded: Date;
  }[];
  orders?: string[];
  paymentMethods?: {
    type: string;
    details: string;
  }[];
  billingAddresses?: {
    name: string;
    state: string;
    zip: string;
  }[];
  shippingAddresses?: {
    name: string;
    state: string;
    zip: string;
  }[];
}

export type Product = {
  accountId: string;
  _id?: string;
  name: string;
  description: string;
  rating?: number;
  category: string;
  price: number;
  reviews?: {
    review: string;
    _id?: string;
    rating?: number;
  }[];
  quantity: number;
  imageUrls?: string[];
  tags?: string[];
  creationDate?: Date;
};
export type Transaction = {
  _id?: string;
  product: string;
  buyer: string;
  seller: string;
  quantity: number;
  total: number;
  status: "Pending" | "Fulfilled" | "Canceled";
  transactionDate?: Date;
};
