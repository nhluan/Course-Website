import express from "express";
import learnController from "../../controllers/learn.controller.js";

const router = express.Router();

router.get("/:id_course/lecture/:id_lesson", learnController.showLesson);
// router.get("/:id-course", learnController.overView);

export default router;
