import express from "express";
import courseController from "../../controllers/courses.controller.js";

const router = express.Router();
router.get("/mycourses/modify/lesson", courseController.renderModifyLesson);
router.post("/mycourses/modify/lesson", courseController.modifyLesson);
router.get("/mycourses/modify", courseController.renderModifyCourse);
router.post("/mycourses/modify", courseController.modifyCourse);

router.get("/mycourses/:id", courseController.myCourses);
router.post("/add", courseController.add);
router.put("/update:id", courseController.update);
router.get("/:slug", courseController.detailCourse);

router.post("/regCourse", courseController.regCourse);
router.post("/postReview", courseController.postReview);
router.post("/addWatchList", courseController.regWatchList);
router.post("/delWatchList", courseController.delWatchList);


// router.get("/", courseController.findCourseDetailById);

export default router;
