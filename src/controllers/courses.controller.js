import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import moment from "moment";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import courseModel from "./../models/course.model.js";
import * as stream from "stream";
import { render } from "node-sass";
import { log } from "console";

class CourseController {
  // detailCourse(req, res) {
  // res.render("detailCourse");
  //GET /:ID

  async detailCourse(req, res) {
    const userOnl = res.locals.authUser;
    // console.log(userOnl);
    const idCourse = req.query.id || "";

    if (idCourse == "") return res.redirect("back");

    console.log("auth: ", res.locals.auth);
    var coursesRe;

    if (res.locals.auth) {
      coursesRe = await courseModel
        .findCourseRe(userOnl.id_user)
        .then((data) => data)
        .catch((e) => console.log(e));
    }

    console.log("id course: ", req.query.id);
    // console.log("id course: ", req.params.id);
    const fullLesson = await courseModel
      .findAllLessonByIdCourse(req.query.id)
      .then((data) => data)
      .catch((e) => console.log(e));
    const fullReview = await courseModel
      .findReviewCourse(req.query.id)
      .then((data) => data)
      .catch((e) => console.log(e));
    console.log("Full review: ", fullReview);

    const courseFake = await courseModel
      .findCourseDetailById(req.query.id)
      .then((data) => data)
      .catch((e) => console.log(e));

    console.log("course fake: ", courseFake);
    console.log("id teacher", courseFake[0].id_teacher);

    const inforTeacher = await courseModel
      .findTeacherOfCourse(courseFake[0].id_teacher)
      .then((data) => data)
      .catch((e) => console.log(e));

    console.log("infor teacher", inforTeacher);

    const nameTeacher = inforTeacher[0].name_user;
    const avatarTeacher = inforTeacher[0].avatar_user;

    //tinh chi lai cac noi dung can thiet
    if (fullReview.length === 0) {
      var agvRating = 0;
    } else {
      var agvRating = 0;
      var sum = 0;
      for (let i = 0; i < fullReview.length; i++) {
        sum = sum + fullReview[i].point;
      }
      agvRating = sum / fullReview.length;
      agvRating = agvRating.toFixed(2);
    }

    var numberRating = fullReview.length;
    var checkShowContent = true;

    if (numberRating === 0) {
      // khong co nguoi danh gia
      checkShowContent = false;
    }
    // console.log("Trung binh: ", agvRating);
    // console.log("So luong danh gia: ", numberRating);
    // console.log("Check show content: ", checkShowContent);

    // console.log("Full lesson: ", fullLesson);
    const startLesson = fullLesson[0];
    // console.log("start lesson: ", startLesson);
    console.log("cac khoa hoc da dang ki", coursesRe);
    var checkBuy = false;
    if (typeof coursesRe === "undefined") {
      checkBuy = false;
    } else {
      for (let i = 0; i < coursesRe.length; i++) {
        // console.log("Params id: ", typeof req.params.id);
        // console.log("Id course: ", typeof coursesRe[i].id_course);
        if (Number(req.query.id) === coursesRe[i].id_course) {
          checkBuy = true; //da co mua khoa hoc
        }
      }
    }
    console.log("check buy: ", checkBuy);

    //lay danh sach yeu thich
    var checkLove = false; // mac dinh khong co
    if (res.locals.auth) {
      const watchList = await courseModel
        .findWatchList(courseFake[0].id_course, userOnl.id_user)
        .then((data) => data)
        .catch((e) => console.log(e));

      console.log("Watch list: ", watchList);
      if (watchList.length === 1) {
        checkLove = true;
      }
    }

    await courseModel.updateViews(req.query.id);
    var reviewData;
    if (res.locals.auth) {
      //neu co user moi hien thi binh luan
      const dataReview = await courseModel
        .findReview(userOnl.id_user, idCourse)
        .then((data) => data)
        .catch((e) => console.log(e));

      //check
      if (dataReview.length >= 1) {
        //da co binh luan
        reviewData = {
          point: dataReview[0].point,
          content: dataReview[0].content,
        };
      } else {
        //chua co binh luan nao
        reviewData = {
          point: 5,
          content: "Khoa hoc rat xung dang!!!",
        };
      }

      console.log("data review: ", reviewData);
    } else {
      reviewData = {
        point: 5,
        content: "Khoa hoc rat xung dang!!!",
      };
    }


    const countCourse = await courseModel.countCourseByTeacher(inforTeacher[0].id_user);
    const countStudent = await courseModel.countNumStudentByTeacher(inforTeacher[0].id_user);

    await courseModel
      .findAllLessonByIdCourse(req.query.id)
      .then((data) => {
        // console.log(data);
        res.render("detailCourse", {
          courses: data,
          empty: data.length === 0,
          startLesson: startLesson,
          checkBuy: checkBuy,
          fullReview: fullReview,
          checkShowContent: checkShowContent,
          numberRating: numberRating,
          agvRating: agvRating,
          nameTeacher: nameTeacher,
          numberLesson: data.length,
          checkLove: checkLove,
          reviewData: reviewData,
          avatar_user: avatarTeacher,
          countCourseByTeacher: countCourse[0].amount,
          countStudent: countStudent[0].count,
          duration: courseFake[0].duration
        });
      })
      .catch((e) => console.log(e));
  }

  async myCourses(req, res) {
    const id = req.params.id || 0;
    const isTeacher = req.query.teacher;
    // console.log(isTeacher);
    

    if (isTeacher === "true") {
      const countCoursesTeacher = await courseModel.countCourseByTeacher(id)

      await courseModel
        .findMyCoursesTeacher(id)
        .then((dataRaw) => {
          // console.log(data);
          const data = dataRaw.map((obj) => {
            return {
              ...obj,
              creation_date: moment(obj.creation_date).format("DD/MM/YYYY"),
              isTeacher,
              tuition_fee: obj.tuition_fee.toLocaleString("it-IT", {
                style: "currency",
                currency: "VND",
              }),
            };
          });
          res.render("myCourses", {
            data: data,
            empty: data.length === 0,
            isTeacher,
          });
        })
        .catch((e) => console.log(e));
    } else {
      const countCoursesStudent = await courseModel.countCourseByTeacher(id)
      await courseModel
        .findMyCoursesStudent(id)
        .then((dataRaw) => {
          // console.log(data);
          const data = dataRaw.map((obj) => {
            return {
              ...obj,
              creation_date: moment(obj.creation_date).format("DD/MM/YYYY"),
              isTeacher,
              tuition_fee: obj.tuition_fee.toLocaleString("it-IT", {
                style: "currency",
                currency: "VND",
              }),
            };
          });
          console.log(data);
          res.render("myCourses", {
            data: data,
            empty: data.length === 0,
          });
        })
        .catch((e) => console.log(e));
    }
  }

  async renderModifyCourse(req, res) {
    const modify = req.query.modify;;
    const id = req.query.id_course;

    if (modify == "add") {
      const course = {
        name_course: "",
        tuition_fee: "",
        brief_description: "",
        detail_description: ""

      }
      res.render("modifyCourse", {
        course: course
      });
    }
    else {
      const course = await courseModel.findCourseDetailById(id);
      console.log(course);
      res.render("modifyCourse", {
        name_course: course[0].name_course,
        tuition_fee: course[0].tuition_fee,
        brief_description: course[0].brief_description,
        detail_description: course[0].detailed_description
      });
    }

  }

  async modifyCourse(req, res) {
    let avatar;
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/img/courses"));
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        avatar =
          "course" +
          "-" +
          uniqueSuffix +
          "." +
          file.originalname.split(".").pop();
        cb(null, avatar);
      },
    });
    const upload = multer({ storage });
    upload.single("avatar", 1)(req, res, async function (err) {
      if (err) {
        console.error(err);
      } else {
        // console.log(req.body);
        const modify = req.query.modify;
        const id_course = req.query.id_course || "";

        const title = req.body.Title;
        const id_teacher = req.body.IdTeacher;
        const price = req.body.Price;
        const briefDes = req.body.BriefDes;
        const fullDes = req.body.FullDes;
        const catelv2 = req.body.CategoryLevel2;
        // const avatar = req.body.avatar;
        const date = new Date();
        const AddDate =
          date.getFullYear() +
          "-" +
          (parseInt(date.getMonth()) + 1) +
          "-" +
          date.getDate();

        const course = {
          name_course: title,
          id_teacher: id_teacher,
          tuition_fee: price,
          brief_description: briefDes,
          detailed_description: fullDes,
          id_category: catelv2,
          avatar: avatar,
          creation_date: AddDate,
        };

        if (modify == "add") {
          await courseModel.addNewCourse(course);
        } else {
          await courseModel.updateCourse(course, id_course);
        }

        res.render("modifyCourse");
      }
    });
  }

  async renderModifyLesson(req, res) {
    const id_lesson = req.query.id_lesson || "";
    const modify = req.query.modify;
    let lesson = {};
    if (modify == "update") {
      lesson = await courseModel.findLessonById(req.query.id, id_lesson);
      console.log("update");
    } else {
      lesson = [
        {
          name_lession: "",
          link_video: "",
        },
      ];
    }
    const course = await courseModel.findById(req.query.id);
    console.log(lesson);
    res.render("modifyLesson", {
      name_course: course[0].name_course,
      lesson: lesson[0],
    });
  }

  async modifyLesson(req, res) {
    const upload = multer();
    upload.single()(req, res, async function () {
      const id_course = req.query.id;
      const name_lesson = req.body.nameLesson;
      const link_video = req.body.link;

      if (req.query.modify == "add") {
        const lesson = {
          id_course: id_course,
          name_lession: name_lesson,
          link_video: link_video,
        };
        await courseModel.addNewLesson(lesson);
        await courseModel.uppdateNumLesson(id_course);
        await courseModel.updateDuration(id_course);
      } else {
        const lesson = {
          name_lession: name_lesson,
          link_video: link_video,
          id_lesson: req.query.id_lesson,
        };
        await courseModel.updateLesson(lesson);
      }
      const id_lesson = req.query.id_lesson || "";
      const modify = req.query.modify;
      let lesson = {};
      if (modify == "update") {
        lesson = await courseModel.findLessonById(req.query.id, id_lesson);
        console.log("update");
      } else {
        lesson = [
          {
            name_lession: "",
            link_video: "",
          },
        ];
      }
      const course = await courseModel.findById(req.query.id);
      console.log(lesson);
      res.render("modifyLesson", {
        name_course: course[0].name_course,
        lesson: lesson[0],
      });
    });
  }

  // async findAllCategory(req, res) {
  //   await courseModel
  //     .findAll()
  //     .then((data) => {
  //       res.render("home", {
  //         courses: data,
  //         empty: data.length === 0,
  //       });
  //       // console.log(data);
  //     })
  //     .catch((e) => console.log(e));
  // }

  async findAll(req, res) {
    await courseModel
      .findAll()
      .then((data) => {
        res.render("home", {
          courses: data,
          empty: data.length === 0,
        });
        // console.log(data);
      })
      .catch((e) => console.log(e));
  }

  async findById(req, res) {
    await courseModel
      .findById(req.params.id)
      .then((data) => res.json({ data }))
      .catch((e) => console.log(e));
  }

  async add(req, res) {
    courseModel
      .add(req.body)
      .then((ret) => {
        res.json({ msg: ret });
      })
      .catch((e) => res.json(e));
  }

  async update(req, res) {
    await courseModel.update(req.body).then();
  }

  async regCourse(req, res) {
    const { id_course, id_lesson } = req.body;
    // console.log("id course: ", id_course);
    // console.log("id lesson: ", id_lesson);
    const idUser = res.locals.authUser.id_user;
    // console.log("id user:", idUser);
    //learn/id_course/lecture/id_lesson
    const date = new Date();
    const AddDate =
      date.getFullYear() +
      "-" +
      (parseInt(date.getMonth()) + 1) +
      "-" +
      date.getDate();
    const regUserCourse = {
      id_student: idUser,
      id_course: id_course,
      registration_date: AddDate,
    };

    await courseModel.registerCourse(regUserCourse);
    // const userReg = await courseModel.findCourseRe(idUser);

    // console.log("da dang ki: ", userReg);
    const pathProgress = "/learn/" + id_course + "/lecture/" + id_lesson;
    res.redirect(pathProgress);
  }

  async postReview(req, res) {
    const { pointReview, id_course, name_course, contentReview } = req.body;

    const pointReview2 = parseInt(pointReview);
    const idUser = res.locals.authUser.id_user;

    // console.log("Point Review: ", pointReview2);
    // console.log("Content Review: ", contentReview);
    // console.log("id course: ", id_course);
    // console.log("name course: ", name_course);
    // console.log("id user: ", typeof idUser);
    var nameCourse = name_course.replace(/ /g, "-");

    nameCourse = nameCourse.toLowerCase();
    nameCourse = nameCourse.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    nameCourse = nameCourse.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    nameCourse = nameCourse.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    nameCourse = nameCourse.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    nameCourse = nameCourse.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    nameCourse = nameCourse.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    nameCourse = nameCourse.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    nameCourse = nameCourse.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    nameCourse = nameCourse.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư

    nameCourse = nameCourse.trim();
    console.log("name course: ", nameCourse);

    //check da binh luan hay chua?
    const dataReview = await courseModel
      .findReview(idUser, id_course)
      .then((data) => data)
      .catch((e) => console.log(e));

    //neu do dai mang lon hoac bang 1 : nghia la dang muon edit lại
    console.log("data view: ", dataReview);
    console.log("do dai data view: ", dataReview.length);

    if (dataReview.length >= 1) {
      const date = new Date();
      const AddDate =
        date.getFullYear() +
        "-" +
        (parseInt(date.getMonth()) + 1) +
        "-" +
        date.getDate();
      const dataInput = {
        id_course: parseInt(id_course),
        id_reviewer: idUser,
        point: pointReview2,
        content: contentReview,
        date: AddDate,
      };

      const idReview = dataReview[0].id_review;

      await courseModel.updateReview(idReview, dataInput);
    } else {
      const date = new Date();
      const AddDate =
        date.getFullYear() +
        "-" +
        (parseInt(date.getMonth()) + 1) +
        "-" +
        date.getDate();
      const dataInput = {
        id_course: parseInt(id_course),
        id_reviewer: idUser,
        point: pointReview2,
        content: contentReview,
        date: AddDate,
      };
      await courseModel.reviewCourse(dataInput);
    }
    const pathRedirect = "/course/" + nameCourse + "?id=" + id_course;

    console.log("path redirect: ", pathRedirect);

    res.redirect(pathRedirect);
  }

  async regWatchList(req, res) {
    const { id_course, id_user, name_course } = req.body;
    console.log("id course: ", id_course);
    console.log("id user: ", id_user);

    const infoAdd = {
      id_student: parseInt(id_user),
      id_course: parseInt(id_course),
    };

    await courseModel.addWatchList(infoAdd);

    var nameCourse = name_course.replace(/ /g, "-");

    nameCourse = nameCourse.toLowerCase();
    nameCourse = nameCourse.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    nameCourse = nameCourse.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    nameCourse = nameCourse.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    nameCourse = nameCourse.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    nameCourse = nameCourse.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    nameCourse = nameCourse.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    nameCourse = nameCourse.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    nameCourse = nameCourse.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    nameCourse = nameCourse.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư

    nameCourse = nameCourse.trim();
    console.log("name course: ", nameCourse);

    const pathRedirect = "/course/" + nameCourse + "?id=" + id_course;

    console.log("path redirect: ", pathRedirect);

    res.redirect(pathRedirect);
  }

  async delWatchList(req, res) {
    const { id_course, id_user, name_course } = req.body;
    console.log("id course: ", id_course);
    console.log("id user: ", id_user);

    await courseModel.deleteWatchList(parseInt(id_course), parseInt(id_user));

    var nameCourse = name_course.replace(/ /g, "-");

    nameCourse = nameCourse.toLowerCase();
    nameCourse = nameCourse.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    nameCourse = nameCourse.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    nameCourse = nameCourse.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    nameCourse = nameCourse.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    nameCourse = nameCourse.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    nameCourse = nameCourse.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    nameCourse = nameCourse.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    nameCourse = nameCourse.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    nameCourse = nameCourse.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư

    nameCourse = nameCourse.trim();
    console.log("name course: ", nameCourse);

    const pathRedirect = "/course/" + nameCourse + "?id=" + id_course;

    console.log("path redirect: ", pathRedirect);

    res.redirect(pathRedirect);
  }

  async manageWatchList(req, res) {
    const idUser = res.locals.authUser.id_user;

    const watchListUser = await courseModel.findAllWatchList(idUser);

    console.log("Danh sach yeu thich", watchListUser);

    var linkCourse;

    for (let pos = 0; pos < watchListUser.length; pos++) {
      linkCourse = courseModel.convertLink(watchListUser[pos].name_course);
      linkCourse =
        "/course/" + linkCourse + "?id=" + watchListUser[pos].id_course;
      watchListUser[pos].linkCourse = linkCourse;
      // console.log("Link course: ", watchListUser[pos].linkCourse);
    }

    res.render("watchList", {
      watchListUser: watchListUser,
    });
  }
}

export default new CourseController();
