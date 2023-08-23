import { Request, Response } from "express";
import * as productService from "../services/productService";
import { CustomRequest } from "../types";

export const findProductById = async (req: CustomRequest, res: Response) => {
  try {
    const productIds: string[] = req.body.productIds;

    const products = await Promise.all(
      productIds.map(async (p) => {
        return await productService.findProductById(p);
      })
    );

    res.status(200).json(products);
  } catch (error) {
    res.status(500).send(error);
  }
};
