import express from "express";
import courseController from "../../controllers/courses.controller.js";

const router = express.Router();

router.get("/", courseController.manageWatchList);


// router.get("/", courseController.findCourseDetailById);

export default router;
