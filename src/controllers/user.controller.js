import multer from "multer";
import path from "path";
import fs from "fs";
import { promisify } from "util";
const unlinkAsync = promisify(fs.unlink);
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import moment from "moment";

import accountModel from "../models/account.model.js";
import courseModel from "../models/course.model.js";

//GET :id
const updateProfileUser = async (req, res) => {
  console.log("da vao trang nay");
  if (req.method === "GET") {
    const idUser = res.locals.authUser;
    console.log("infor user: ", idUser);

    res.render("profileUser", {
      type: req.flash("type"),
      message: req.flash("message"),
    });
  }
  if (req.method === "POST") {
    console.log("redbody", req.body);

    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/img"));
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
          null,
          "user" + "-" + uniqueSuffix + "." + file.originalname.split(".").pop()
        );
      },
    });

    const upload = multer({ storage: storage });
    upload.single("avatar")(req, res, async function (err) {
      if (err) {
        console.log(err);
      } else {
        const { username, dob } = req.body;
        const acc = {
          name_user: username,
          date_of_birth: moment(dob, "DD/MM/YYYY").format("YYYY-MM-DD"),
        };
        const avatar = req.file ? req.file.filename : "";
        console.log("avatar", avatar);
        acc.avatar_user = avatar;
        console.log(acc);
        accountModel
          .updateProfileUser(acc, req.body.email)
          .then((data) => {
            console.log("data: ", data);
            if (data === 0) {
              req.flash("type", "fail");
              req.flash("message", "update fail");
              res.redirect("back");
            } else {
              req.flash("type", "success");
              req.flash(
                "message",
                "update success, please login again to see changes"
              );
              console.log("update success");
              req.session.authUser.avatar_user = avatar;
              req.session.authUser.name_user = username;
              req.session.date_of_birth = moment(
                acc.date_of_birth,
                "YYYY/MM/DD"
              ).format("DD-MM-YYYY");
              res.redirect("back");
            }
          })
          .catch((e) => {
            console.log("err update profile user", e);
          });
      }
    });

    console.log("post");
  }
};

export default { updateProfileUser };

// accountModel
// .updateProfileUser(acc, req.body.email)
// .then((data) => {
//   console.log("data: ", data);
//   if (data === 0) {
//     req.flash("type", "fail");
//     req.flash("message", "update fail");
//     res.redirect("back");
//   } else {
//     req.flash("type", "success");
//     req.flash(
//       "message",
//       "update success, please login again to see changes"
//     );
//     console.log("update success");
//     res.redirect("back");
//   }
// })
// .catch((e) => {
//   console.log("err update profile user", e);
// });
