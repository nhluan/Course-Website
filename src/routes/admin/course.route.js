import express from "express";
import courseController from "../../controllers/admin/course.controller.js";
const router = express.Router();

router.delete("/:id", courseController.delete);
router.get("/disable/:id", courseController.updateActive);
router.get("/", courseController.showListCourse);
export default router;
