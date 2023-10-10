import { NextFunction, Request, Response } from "express";
import * as productService from "../services/productService";
import { CustomRequest } from "../types";
import Product, { IProduct } from "../models/Product";
import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User";

export const findProductById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const productIds: string[] = req.body.productIds;

    const products = await Promise.all(
      productIds.map(async (p) => {
        return await productService.findProductById(p);
      })
    );

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId: string = req.params.productId;

    const product = await productService.findProductById(productId);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await productService.updateProduct(
      req.params.productID,
      req.body
    );
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const findProductOwner = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId: string = req.params.productId;

    const product = await Product.findById(productId)
      .populate("sellerID")
      .exec();

    if (!product) {
      throw new Error("Product not found");
    }

    if (!product.sellerID) {
      throw new Error("Seller not found");
    }
    const foundUser = await User.findById(product.sellerID);
    res.status(200).json(foundUser);
  } catch (error) {
    next(error);
  }
};

export const deleteProductById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await productService.deleteProductById(req.params.productId);
    res.status(200).send({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = new Product(req.body);
    await product.save();

    const sellerID = req.body.sellerID;
    await User.findByIdAndUpdate(sellerID, {
      $push: { products: product._id },
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    next(error);
  }
};

export const uploadToS3 = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const s3 = new AWS.S3({
    signatureVersion: "v4",
  });

  let file = req.files?.productImage;

  if (Array.isArray(file)) {
    file = file[0];
  }

  if (!file) {
    return res.status(400).send({
      message: "No file uploaded",
    });
  }

  const newFileName = `${uuidv4()}_${file.name}`;

  const uploadParams = {
    Bucket: "orchtinimages",
    Key: newFileName,
    Body: file.data,
    ContentType: file.mimetype,
  };
  try {
    const s3Response = await s3.upload(uploadParams).promise();
    console.log("Upload Success", s3Response.Location);
    res.status(200).send({ url: s3Response.Location });
  } catch (error) {
    next(error);
  }
};

export const deleteFromS3 = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const s3 = new AWS.S3({
    signatureVersion: "v4",
  });

  const imageUrl = req.body.imageUrl;

  const key = imageUrl.split("orchtinimages.s3.us-east-2.amazonaws.com/")[1];

  const deleteParams = {
    Bucket: "orchtinimages",
    Key: key,
  };

  try {
    await s3.deleteObject(deleteParams).promise();
    res.status(200).send({ message: "Image successfully deleted" });
  } catch (error) {
    next(error);
  }
};
export const getAllProducts = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await Product.find();

    return res.status(200).send(products);
  } catch (error) {
    next(error);
  }
};

export async function findByCategory(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const category = req.params.categoryName;
    if (!category) {
      return res.status(400).json({ error: "Category not provided" });
    }

    const products = await Product.find({
      category: new RegExp(category, "i"),
    });

    return res.status(200).json(products);
  } catch (err) {
    next(err);
  }
}
