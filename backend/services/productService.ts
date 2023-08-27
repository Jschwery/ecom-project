import Product, { IProduct } from "../models/Product";
import { Document } from "mongoose";

export const findProductById = async (
  productID: string
): Promise<IProduct | null> => {
  return await Product.findById(productID);
};

export async function createProduct(product: IProduct): Promise<Document> {
  try {
    return await Product.create(product);
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Product creation failed");
  }
}
