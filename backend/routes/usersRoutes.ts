import * as userController from "../controllers/userController";
import { extractTokenAndUser } from "../middlewares/extractToken";
import expressFileUpload from "express-fileupload";
import express, { Response } from "express";

const router = express.Router();
router.use(extractTokenAndUser);

router.use(expressFileUpload());

router.post("/users", userController.createUser);

router.post("/users/images", userController.uploadToS3);
router.delete("/users/images", userController.deleteFromS3);

router.get("/users/check", userController.checkUser);
router.put("/users/edit", userController.updateUser);

export default router;
