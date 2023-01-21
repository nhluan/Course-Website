import express from "express";
import errPageController from "../../controllers/errPage.controller.js";

const router = express.Router();

router.get("/",errPageController.page404);

export default router;
