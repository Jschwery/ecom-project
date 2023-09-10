import * as userController from "../controllers/userController";
import { extractTokenAndUser } from "../middlewares/extractToken";
import expressFileUpload from "express-fileupload";
import express, { Response } from "express";
import { middleLogger } from "../middlewares/logger";

const router = express.Router();
router.use(extractTokenAndUser);
router.use(expressFileUpload());
router.use(middleLogger);

router.post("/users", userController.createUser);
router.post("/users/images", userController.uploadToS3);
router.delete("/users/images", userController.deleteFromS3);
router.get("/users/check", userController.checkUser);
router.put("/users/edit", userController.updateUser);
router.put("/users/edit/atomic", userController.updateUser);
router.get("/users/products", userController.getUserProducts);
router.get("/users/:userID/products", userController.getAllUserProduct);

router.get("/users/:userID", userController.getUserByID);

export default router;
