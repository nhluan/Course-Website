import express from "express";
import searchController from "../../controllers/search.controller.js";

const router = express.Router();

router.get("/:course_search", searchController.searchCourse);
router.get("/", searchController.searchCourse);


export default router;