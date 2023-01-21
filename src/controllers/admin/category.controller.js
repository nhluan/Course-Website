import multer from "multer";
import path from "path";
import fs, { link } from "fs";
import { promisify } from "util";
const unlinkAsync = promisify(fs.unlink);
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import categoryModel from "../../models/category.model.js";
import courseModel from "../../models/course.model.js";
import e from "connect-flash";

// class CategoryController {

const showList = async (req, res) => {
  const listLv1 = await categoryModel.findCategoryLv1();
  const fullList = await categoryModel.findAllCategory();
  // console.log(fullList);
  const fullListCategory = [...listLv1, ...fullList];
  // console.log(fullListCategory);
  // console.log(fullListCategory);
  res.render("admin/categoryAdmin.hbs", {
    data: fullListCategory,
    type: req.flash("type"),
    message: req.flash("message"),
    layout: "admin",
  });
};
const add = async (req, res) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../../public/img"));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        "category" +
          "-" +
          uniqueSuffix +
          "." +
          file.originalname.split(".").pop()
      );
    },
  });

  const upload = multer({ storage });
  upload.single("avatar")(req, res, async function (err) {
    if (err) {
      console.log(err);
    } else {
      // console.log(req.file);
      const { nameCategory } = req.body;

      const avatar = req.file ? req.file.filename : "";

      if (req.body.parentCategory === "none") {
        // console.log(nameCategory, avatar);
        const entity = {
          name_category_lv1: nameCategory,
          avatar_category: avatar,
        };
        await categoryModel
          .addCategoryLv1(entity)
          .then((result) => {
            // console.log(result);
            req.flash("type", "success");
            req.flash("message", "add category success");
            res.redirect("/admin/category");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        const id_category_lv1 = req.body.parentCategory;
        const entity = {
          id_category_lv1: id_category_lv1,
          name_category_lv2: nameCategory,
          avatar_category: avatar,
        };

        await categoryModel
          .addCategoryLv2(entity)
          .then(() => {
            req.flash("type", "success");
            req.flash("message", "add category success");
            res.redirect("/admin/category");
          })
          .catch((err) => console.log(err));
      }
    }
  });
};
const update = async (req, res) => {
  // console.log("idlv1: ", req.que.id1);
  // console.log("idlv2: ", req.body.id2);
  if (req.method === "GET") {
    // console.log("get", req.headers);
    console.log("id1", req.params.id1);
    console.log("id2", req.params.id2);

    if (req.params.id2 === "null") {
      console.log("test");
      await categoryModel
        .findCategoryLv1ById(req.params.id1)
        .then(async (data) => {
          await categoryModel.findCategoryLv1().then((listLv1) => {
            console.log("data", data);
            data[0].referer = req.headers.referer;
            res.render("admin/updateCategory.hbs", {
              data: data[0],
              listLv1: listLv1,
              layout: "admin",
            });
          });
        })
        .catch((e) => console.log(e))
        .catch((e) => console.log(e));
    } else {
      categoryModel
        .findCategoryLv2ById(req.params.id2)
        .then(async (data) => {
          await categoryModel
            .findCategoryLv1()
            .then((listLv1) => {
              // data[0].referer = req.headers.referer;
              res.render("admin/updateCategory.hbs", {
                data: data[0],
                listLv1: listLv1,
                layout: "admin",
              });
            })
            .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));
    }
  }
  if (req.method === "POST") {
    const id = req.params.id2 === "null" ? req.params.id1 : req.params.id2;
    console.log("id post", id);
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../public/img"));
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
          null,
          "category" +
            "-" +
            uniqueSuffix +
            "." +
            file.originalname.split(".").pop()
        );
      },
    });

    const upload = multer({ storage });
    upload.single("avatar")(req, res, async function (err) {
      if (err) {
        console.log(err);
      } else {
        // console.log(req.file);
        const { nameCategory } = req.body;

        const avatar = req.file ? req.file.filename : "";

        if (req.body.parentCategory === "none") {
          // console.log(nameCategory, avatar);
          const entity = {
            name_category_lv1: nameCategory,
            avatar_category: avatar,
          };
          await categoryModel
            .updateCategoryLv1(id, entity)
            .then((result) => {
              res.redirect("/admin/category");
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          const id_category_lv1 = req.body.parentCategory;
          const entity = {
            id_category_lv1: id_category_lv1,
            name_category_lv2: nameCategory,
            avatar_category: avatar,
          };

          await categoryModel
            .updateCategoryLv2(id, entity)
            .then((result) => result)
            .catch((err) => console.log(err));
          res.redirect("/admin/category");
        }
      }
    });
  }
};

const isCategoryHaveCourse = async (id) => {
  const list = await courseModel.findCourseOfCategoryLv2(id);
  return list.length > 0;
};
const isExistSubCategory = async (id) => {
  const list = await categoryModel.findCategoryLv2ByLv1(id);
  return list.length > 0;
};

const deleteCategory = async (req, res) => {
  if (req.params.id2 === "null") {
    const check = await isExistSubCategory(req.params.id1);
    if (check) {
      req.flash("type", "fail");
      req.flash(
        "message",
        "cannot delete this category because it has sub category"
      );
      res.redirect("back");
    } else {
      await categoryModel
        .findCategoryLv1ById(req.params.id1)
        .then(async (data) => {
          const linkAvatar = data[0].avatar_category;
          await categoryModel
            .deleteCategoryLv1(req.params.id1)
            .then(async (data) => {
              await unlinkAsync(
                path.join(__dirname, `../../public/img/${linkAvatar}`)
              )
                .then(() => {
                  req.flash("type", "success");
                  req.flash("message", "delete success");
                  res.redirect("back");
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        })
        .catch((e) => console.log(e));
    }
  } else {
    const check = await isCategoryHaveCourse(req.params.id2);
    if (check) {
      req.flash("type", "fail");
      req.flash("message", "cannot delete this category because it has course");
      res.redirect("back");
    } else {
      await categoryModel
        .findCategoryLv2ById(req.params.id2)
        .then(async (data) => {
          const linkAvatar = data[0].avatar_category;
          await categoryModel
            .deleteCategoryLv2(req.params.id2)
            .then(async (data) => {
              console.log("return ", linkAvatar);
              if (linkAvatar === "") {
                req.flash("type", "success");
                req.flash("message", "delete success");
                res.redirect("back");
              } else {
                await unlinkAsync(
                  path.join(__dirname, `../../public/img/${linkAvatar}`)
                )
                  .then((data) => {
                    console.log(data);
                    req.flash("type", "success");
                    req.flash("message", "delete success");
                    res.redirect("back");
                  })
                  .catch((err) => console.log(err));
              }
            })
            .catch((err) => console.log(err));
        })
        .catch((e) => console.log(e));
    }
  }
};

export default { showList, add, update, deleteCategory };
