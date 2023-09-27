import * as userController from "../controllers/userController";
import { extractTokenAndUser } from "../middlewares/extractToken";
import expressFileUpload from "express-fileupload";
import express, { Response } from "express";
import { middleLogger } from "../middlewares/logger";

const router = express.Router();
router.use(expressFileUpload());
router.use(middleLogger);

router.post("/users", extractTokenAndUser, userController.createUser);
router.post("/users/images", extractTokenAndUser, userController.uploadToS3);
router.delete(
  "/users/images",
  extractTokenAndUser,
  userController.deleteFromS3
);
router.get("/users/check", extractTokenAndUser, userController.checkUser);
router.put("/users/edit", extractTokenAndUser, userController.updateUser);
router.put(
  "/users/edit/atomic",
  extractTokenAndUser,
  userController.updateUser
);
router.get(
  "/users/products",
  extractTokenAndUser,
  userController.getUserProducts
);
router.get(
  "/users/:userID/products",
  extractTokenAndUser,
  userController.getAllUserProduct
);

router.get("/users/:userID", userController.getUserByID);

export default router;
