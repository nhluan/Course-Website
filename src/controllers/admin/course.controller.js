import courseModel from "../../models/course.model.js";
import moment from "moment";

class CourseController {
  async showListCourse(req, res) {
    const limit = 5;
    const numCourses = await courseModel.countCourse();
    console.log(numCourses[0].amount);
    let numberPage = Math.floor(numCourses[0].amount / limit);

    if (numCourses[0].amount % limit > 0) {
      numberPage++;
    }

    const page = req.query.page || 1;
    const offset = (page - 1) * limit;
    const pageNumbers = [];
    for (let i = 1; i <= numberPage; i++) {
      pageNumbers.push({
        value: i,
        isCurrent: i == page,
      });
    }
    console.log("pageNumbers", pageNumbers);
    console.log("num", numberPage);

    await courseModel
      .findCoursePaging(limit, offset)
      .then((dataRaw) => {
        const data = dataRaw.map((obj) => {
          return {
            ...obj,
            creation_date: moment(obj.creation_date).format("DD/MM/YYYY"),
          };
        });
        res.render("admin/course.hbs", {
          type: req.flash("type"),
          message: req.flash("message"),
          data: data,
          pageNumbers: pageNumbers,
          isExist: data.length === 0,
          layout: "admin",
        });
      })
      .catch((e) => {
        console.log("err find course");
      });
  }
  delete = async (req, res) => {
    console.log("da vo delete");
    const id = req.params.id;
    console.log("id course", id);
    await courseModel
      .deleteById(id)
      .then((data) => {
        console.log(data);
        if (data === 0) {
          req.flash("type", "fail");
          req.flash("message", "delete fail");
          res.redirect("back");
        } else {
          req.flash("type", "success");
          req.flash("message", "delete success");
          res.redirect("back");
        }
      })
      .catch((e) => {
        console.log("err delete course");
      });
  };

  updateActive = async (req, res) => {
    const id = req.params.id;
    const value = req.query.value;
    await courseModel
      .updateActive(id, value)
      .then(() => {
        req.flash("type", "success");
        if (value == 1) {
          req.flash("message", "unblock success");
        } else {
          req.flash("message", "block success");
        }
        res.redirect(req.headers.referer);
      })
      .catch((e) => {
        console.log("err update course");
      });
  };
}

export default new CourseController();
