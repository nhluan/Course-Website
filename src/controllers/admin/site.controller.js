import userModel from "../../models/account.model.js";
import courseModel from "../../models/course.model.js";
class SiteController {
  async showDashBoard(req, res) {
    const amountTeacher = await userModel
      .countUserTeacher()
      .then((data) => data[0].amount)
      .catch((e) => console.log(e));

    const amountStudent = await userModel
      .countUserStudent()
      .then((data) => data[0].amount)
      .catch((e) => console.log(e));

    const amountCourse = await courseModel
      .countCourse()
      .then((data) =>data[0].amount)
      .catch((e) => console.log(e));

    const amountCourseNotActive = await courseModel
      .countCourseNotActive()
      .then((data) => data[0].amount)
      .catch((e) => console.log(e));  
    
    // console.log(amountTeacher, amountStudent, amountCourse, amountCourseActive);
    res.render("admin/adminMain.hbs", {
      amountTeacher,
      amountStudent,
      amountCourse,
      amountCourseNotActive,
      layout: "admin" });
  }
}

export default new SiteController();
