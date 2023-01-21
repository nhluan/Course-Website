import express from "express";
import authController from "../../controllers/auth.controller.js";
const router = express.Router();

router.get("/newsignup", (req, res) => {
  res.render("newSignup", { layout: false });
});
router.get("/newlogin", (req, res) => {
  res.render("newLogin", { layout: false });
});
router.get("/login", authController.login);
router.post("/login", authController.login);
router.get("/signup", authController.signup);
router.post("/signup", authController.signup);
router.post("/logout", authController.logout);
router.get("/verify/:email/:token", authController.verify);
router.get("/verified", authController.verified);
router.post("/requestPasswordReset", authController.requestPasswordReset);
router.get("/requestPasswordReset", authController.requestPasswordReset);
router.get("/resetPassword/:email/:token", authController.resetPassword);
router.post("/resetPassword/:email/:token", authController.resetPassword);
router.get("/isExist", authController.isExist);

// router.post('/isExist', authController.isExist)
export default router;
