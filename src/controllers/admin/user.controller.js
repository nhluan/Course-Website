import bcryptjs from "bcryptjs";
import moment from "moment";
import accountModel from "../../models/account.model.js";

class UserController {
  showUserStudent = async (req, res) => {
    await accountModel
      .findAllUserStudent()
      .then((dataRaw) => {
        const data = dataRaw.map((obj) => {
          return {
            ...obj,
            date_of_birth: moment(obj.date_of_birth).format("DD/MM/YYYY"),
          };
        });
        res.render(
          "admin/userStudent.hbs",
          // { data: data, isExist: data.length === 0 },
          {
            type: req.flash("type"),
            message: req.flash("message"),
            data: data,
            isExist: data.length === 0,
            layout: "admin",
          }
        );
      })
      .catch((e) => {
        console.log("err find student");
      });
  };

  showUserTeacher = async (req, res) => {
    await accountModel
      .findAllUserTeacher()
      .then((dataRaw) => {
        const data = dataRaw.map((obj) => {
          return {
            ...obj,
            date_of_birth: moment(obj.date_of_birth).format("DD/MM/YYYY"),
          };
        });
        res.render(
          "admin/userTeacher.hbs",
          // { data: data, isExist: data.length === 0 },
          {
            type: req.flash("type"),
            message: req.flash("message"),
            data: data,
            isExist: data.length === 0,
            layout: "admin",
          }
        );
      })
      .catch((e) => {
        console.log("err find student");
      });
  };

  createUser = async (req, res) => {
    if (req.method == "GET") {
      res.render("admin/createUser", { layout: "admin" });
    }
    if (req.method == "POST") {
      const username = req.body.username;
      const email = req.body.email;
      const password = req.body.password;
      const saltRounds = bcryptjs.genSaltSync(10);
      const passHashed = bcryptjs.hashSync(password, saltRounds);
      const dob = moment(req.body.dob, "DD/MM/YYYY").format("YYYY-MM-DD");

      const acc = {
        name_user: username,
        email: email,
        password: passHashed,
        date_of_birth: dob,
        role: req.body.role,
      };
      await accountModel
        .addUser(acc)
        .then((e) => {
          if (req.body.role == 1) {
            req.flash("type", "success");
            req.flash("message", "create account teacher success");
            res.redirect("teacher");
          } else {
            req.flash("type", "success");
            req.flash("message", "create account student success");
            res.redirect("student");
          }
        })
        .catch((e) => console.log(e));
    }
  };
  update = async (req, res) => {
    if (req.method === "GET") {
      console.log("get", req.headers);
      await accountModel
        .findUserById(req.params.id)
        .then((data) => {
          data[0].date_of_birth = moment(data[0].date_of_birth).format(
            "DD/MM/YYYY"
          );
          data[0].referer = req.headers.referer;
          console.log("find user by id", data);
          res.render("admin/updateUser", {
            data: data,
            isExist: data.length === 0,
            layout: "admin",
          });
        })
        .catch((e) => {
          console.log("err find user by id sent");
        });
    } else if (req.method === "POST") {
      const { username, dob } = req.body;
      const acc = {
        name_user: username,
        date_of_birth: moment(dob, "DD/MM/YYYY").format("YYYY-MM-DD"),
      };

      await accountModel
        .updateUser(req.params.id, acc)
        .then((e) => {
          req.flash("type", "success");
          req.flash("message", "update account success");
          res.redirect(req.body.referer);
        })
        .catch((e) => console.log(e));
    }
  };

  delete = async (req, res) => {
    await accountModel
      .deleteUserById(req.params.id)
      .then((e) => {
        req.flash("type", "success");
        req.flash("message", "delete account success");
        res.redirect(req.headers.referer);
      })
      .catch((e) => {
        console.log("err find user by id sent 2");
      });
  };
  updateActive = async (req, res) => {
    await accountModel
      .updateActive(req.params.id, req.query.value)
      .then((e) => {
        if (req.query.value == 1) {
          req.flash("type", "success");
          req.flash("message", "unblock account success");
          res.redirect(req.headers.referer);
        } else {
          req.flash("type", "success");
          req.flash("message", "block account success");
          res.redirect(req.headers.referer);
        }
      })
      .catch((e) => {
        console.log("err find user by id sent 2");
      });
  };
  viewProfile = async (req, res) => {
    console.log("id", req.params.id);
    await accountModel
      .findUserById(req.params.id)
      .then((data) => {
        data[0].date_of_birth = moment(data[0].date_of_birth).format(
          "DD/MM/YYYY"
        );
        console.log(data);
        res.render("admin/profile", {
          data: data,
          layout: "admin",
        });
      })
      .catch((e) => {
        console.log("err find user by id sent");
      });
  };
}

export default new UserController();
