import express from "express";
import categoryController from "../../controllers/category.controller.js";

const router = express.Router();

router.get("/:categorylv1/:categorylv2",categoryController.categoryCourseLevel2 );
router.get("/:category", categoryController.categoryCourseLevel1);

export default router;