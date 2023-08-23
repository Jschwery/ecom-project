import Product, { IProduct } from "../models/Product";

export const findProductById = async (
  productID: string
): Promise<IProduct | null> => {
  return await Product.findById(productID);
};
