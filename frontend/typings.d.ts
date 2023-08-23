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
  products?: string[];
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
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phoneNumber: string;
  }[];
  reviews?: {
    product: string;
    rating: number;
    comment: string;
    date: Date;
  }[];
}

export type Product = {
  accountId: string;
  _id?: string;
  productName: string;
  productDescription: string;
  category: string;
  price: number;
  quantity: number;
  imageUrls?: string[];
  tags?: string[];
  creationDate?: Date;
};
