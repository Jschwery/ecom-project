import express from "express";
import * as productController from "../controllers/productController";
import { extractTokenAndUser } from "../middlewares/extractToken";
import expressFileUpload from "express-fileupload";

const router = express.Router();
router.use(expressFileUpload());

router.post("/products/details", productController.findProductById);


router.get("/products/:productId", productController.getProductById);

  router.post(
  "/products/create",
  extractTokenAndUser,
  productController.createProduct
);

router.get(
  "/products",
  extractTokenAndUser,
  productController.getAllProducts
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

export default router;
