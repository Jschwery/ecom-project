import { Request, Response } from "express";
import * as productService from "../services/productService";
import { CustomRequest } from "../types";
import Product, { IProduct } from "../models/Product";
import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User";

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

export const getProductById = async (req: CustomRequest, res: Response) => {
  try {
    const productId: string = req.params.productId;

    const product = await productService.findProductById(productId);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).send(error);
  }
};


export const deleteProductById = async (req: CustomRequest, res: Response) => {
  try {
    await productService.deleteProductById(req.params.productId);
    res.status(200).send({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send({ error: "Failed to delete product" });
  }
};

export const createProduct = async (req: CustomRequest, res: Response) => {
  try {
    const product = new Product(req.body);
    await product.save();

    const sellerID = req.body.sellerID;
    await User.findByIdAndUpdate(sellerID, {
      $push: { products: product._id },
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};

export const uploadToS3 = async (req: CustomRequest, res: Response) => {
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
  } catch (error: any) {
    console.error("Error while uploading to S3:", error);
    res.status(500).send({
      message: "Failed to upload image to S3",
      error: error.message,
    });
  }
};

export const deleteFromS3 = async (req: CustomRequest, res: Response) => {
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
  } catch (error: any) {
    res.status(500).send({
      message: "Failed to delete image from S3",
      error: error.message,
    });
  }
};
export const getAllProducts = async (req: CustomRequest, res: Response) => {
  try {
      const products = await Product.find();  

      return res.status(200).send(products);
  } catch (error: any) {
      return res.status(500).send({ message: "Error fetching products", error: error.message });
  }
}


