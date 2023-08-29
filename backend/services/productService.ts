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

export async function deleteProductById(
  productID: string
): Promise<Document | null> {
  try {
    return await Product.findByIdAndDelete(productID);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Product deletion failed");
  }
}
export async function updateProduct(
  productID: string,
  updates: Partial<IProduct>
): Promise<Document | null> {
  try {
    return await Product.findByIdAndUpdate(productID, updates, { new: true });
  } catch (error) {
    console.error("error updating product:", error);
    throw new Error("Product update failed");
  }
}
