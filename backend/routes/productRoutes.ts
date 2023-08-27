import express from "express";
import * as productController from "../controllers/productController";
import { extractTokenAndUser } from "../middlewares/extractToken";
import expressFileUpload from "express-fileupload";

const router = express.Router();
router.use(expressFileUpload());

router.post("/products/details", productController.findProductById);

router.post(
  "/products/create",
  extractTokenAndUser,
  productController.createProduct
);
router.post(
  "/products/images",
  extractTokenAndUser,
  productController.uploadToS3
);
router.delete(
  "/products/images",
  extractTokenAndUser,
  productController.deleteFromS3
);

export default router;
