import express from "express";
import profileUserController from "../../controllers/user.controller.js"

const router = express.Router();

router.get("/", profileUserController.updateProfileUser);
router.post("/", profileUserController.updateProfileUser);

export default router;
