import express from "express";
import siteController from "../../controllers/admin/site.controller.js";
const router = express.Router();

router.get("/", siteController.showDashBoard);

export default router;
