import express from "express";
import * as productController from "../controllers/productController";
import { extractTokenAndUser } from "../middlewares/extractToken";
import expressFileUpload from "express-fileupload";

const router = express.Router();
router.use(expressFileUpload());

router.post("/products", extractTokenAndUser, productController.createProduct);

router.get("/products", extractTokenAndUser, productController.getAllProducts);

router.put(
  "/products/:productID",
  extractTokenAndUser,
  productController.updateProduct
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
router.delete(
  "/products/:productId",
  extractTokenAndUser,
  productController.deleteProductById
);
router.get("/products/owner/:productId", productController.findProductOwner);
router.get("/products/:productId", productController.getProductById);

export default router;
