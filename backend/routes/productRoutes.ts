import express from "express";
import * as productController from "../controllers/productController";
import { extractTokenAndUser } from "../middlewares/extractToken";

const router = express.Router();
router.use(extractTokenAndUser);

router.post("/product/details", productController.findProductById);

export default router;
