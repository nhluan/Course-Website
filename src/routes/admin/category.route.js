import express from "express";
import categoryController from "../../controllers/admin/category.controller.js";

const router = express.Router();

router.get("/", categoryController.showList);
router.get("/update/:id1/:id2", categoryController.update);
router.post("/update/:id1/:id2", categoryController.update);
router.post("/add", categoryController.add);
router.delete("/:id1/:id2/delete", categoryController.deleteCategory);
// router.get("/add", categoryController.showAddCategory);
// router.post("/add", categoryController.addCategory);
// router.get("/edit/:id", categoryController.showEditCategory);
// router.post("/edit/:id", categoryController.editCategory);
// router.delete("/:id", categoryController.deleteCategory);

export default router;
