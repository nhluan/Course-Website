import express from "express";
import siteController from "../../controllers/site.controller.js";

const router = express.Router();

router.get("/findAllSession", siteController.checkSession);
router.get("/deleteAllSession", siteController.deleteAllSession);

router.get("/", siteController.index);

export default router;
