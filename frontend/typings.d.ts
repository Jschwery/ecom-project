import "react-dom";

declare module "*.jpeg";
declare module "*.png";
declare global {
  interface NodeRequire {
    context: (
      directory: string,
      useSubdirectories?: boolean,
      regExp?: RegExp,
      mode?: "sync" | "eager" | "weak" | "lazy" | "lazy-once" | Function
    ) => any;
  }
}
export interface User {
  _id: string;
  name: string;
  lastName?: string;
  email: string;
  password?: string;
  status?: "active" | "suspended" | "banned";
  role: string;
  wishlist?: string[];
  cashBalance?: number;
  isVerified: boolean;
  address?: string;
  recentlyViewed?: {
    product: string;
    timeViewed: Date;
  }[];
  googleID?: string;
  age?: number;
  sellerName?: string;
  products?: string[];
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
  specialOffer?: boolean;
  category: string;
  salePrice?: number;
  weight?: number;
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
  productAndCount: {
    productID: string;
    productCount: number;
  }[];
  buyerID: string;
  sellerID: string[];
  orderNumber: Number;
  quantity: number;
  total: number;
  status:
    | "Pending"
    | "Fulfilled"
    | "Canceled"
    | "pending"
    | "fulfilled"
    | "canceled";
  transactionDate?: Date;
};
