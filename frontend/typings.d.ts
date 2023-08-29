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
  rating?: number;
  googleID?: string;
  age?: number;
  sellerName?: string;
  products?: Product[];
  profilePicture?: string;
  isSeller?: boolean;
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
  }[];
  quantity: number;
  imageUrls?: string[];
  tags?: string[];
  creationDate?: Date;
};
