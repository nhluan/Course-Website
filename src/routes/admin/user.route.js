import express from "express";
import userController from "../../controllers/admin/user.controller.js";
const router = express.Router();

router.get("/create", userController.createUser);
router.get("/viewProfile/:id", userController.viewProfile);
router.post("/create", userController.createUser);
router.get("/update/:id", userController.update);
router.get("/disable/:id", userController.updateActive);
router.post("/update/:id", userController.update);
router.get("/student", userController.showUserStudent);
router.get("/teacher", userController.showUserTeacher);
router.get("/:id", userController.delete);

export default router;
