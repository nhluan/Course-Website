import db from "./../utilities/database.js";

export default {
  async add(entity) {
    return await db("course").insert(entity);
  },

  async findAll() {
    return await db("course"); //viết tắt của select(*) from course
  },
  async findCoursePaging(limit, offset) {
    return await db("course")
      .limit(limit)
      .offset(offset)
      .join("user", "course.id_teacher", "user.id_user")
      .select("*");
  },

  async findById(id) {
    return await db("course").where("id_course", id);
  },

  async update(data) {
    const id_course = data.id_course;
    return await db("course").where("id_course", id_course).update(data);
  },
  async updateViews(id) {
    const data = await db("course").where("id_course", id);
    let views = data[0].views + 1;
    console.log(views);
    await db("course").where("id_course", id).update({ views: views });
    return;
  },
  async uppdateReview(id) {
    const sql1 = `update course c set c.point = (select sum(r.point)/count(*) from review r where r.id_course = c.id_course)
    where  c.id_course =`+ id;
    const sql2 = `update course c set c.reviews = (select count(*) from review r where r.id_course = c.id_course)
    where  c.id_course =`+ id;
    await db.raw(sql1);
    await db.raw(sql2);
    return;
  },
  async updateDuration(id) {
    const sql = `update course c set c.duration = (select sum(l.duration) from lesson l where l.id_course = c.id_course)
    where  c.id_course =`+ id;
    await db.raw(sql);
    return;
  },
  async uppdateNumLesson(id) {
    const sql = `update course c set c.num_lesson = (select count(*) from lesson l where l.id_course = c.id_course)
    where  c.id_course =`+ id;
    await db.raw(sql);
    return;
  },
  // async updateNumChapter(id){
  //   const sql=`update course c set c.num_chapter = (select count(*) from chapter ch where ch.id_course = c.id_course)
  //   where  c.id_course =`+ id;
  //   await db.raw(sql);
  //   return;
  // },
  async findCourseDetailById(id) {
    return await db("course").where("course.id_course", id);
  },
  //   join 3 table course, chapter and lessson
  async findLessonById(id_course, id_lesson) {
    console.log("model");
    return await db("course")
      .join("lesson", "course.id_course", "lesson.id_course")
      // .join("chapter", "course.id_course", "chapter.id_course")
      // .join("lesson", function () {
      //   this.on("chapter.id_chapter", "lesson.id_chapter").on(
      //     "chapter.id_course",
      //     "lesson.id_course"
      //   );
      // })
      .where("course.id_course", id_course)
      .where("lesson.id_lesson", id_lesson);
  },
  async findAllLessonByIdCourse(id_course) {
    console.log("model");
    return await db("course")
      .join("lesson", "course.id_course", "lesson.id_course")
      // .join("chapter", "course.id_course", "chapter.id_course")
      // .join("lesson", function () {
      //   this.on("chapter.id_chapter", "lesson.id_chapter").on(
      //     "chapter.id_course",
      //     "lesson.id_course"
      //   );
      // })
      .where("course.id_course", id_course);
  },
  async deleteById(id) {
    return await db("course").where("id_course", id).del();
  },
  async countById(id) {
    const sql =
      `select count(c.id_course) as countCourse from user u,course c 
    where u.id_user = c.id_teacher and c.id_teacher = ` + id;
    const ret = await db.raw(sql);
    return ret[0][0].countCourse;
  },
  async findMyCoursesTeacher(id) {
    const sql =
      `select * from user u,course c 
    where u.id_user = c.id_teacher and c.id_teacher = ` + id;
    // console.log(sql)
    const ret = await db.raw(sql);
    return ret[0];
    // .limit(limit).offset(offset)
    // .where({id_category: id})
  },
  async findMyCoursesStudent(id) {
    const sql =
      `select * from user u,course c,registered_course r
    where u.id_user = r.id_student and c.id_course = r.id_course and r.id_student = ` +
      id;
    // console.log(sql)
    const ret = await db.raw(sql);
    return ret[0];
    // .limit(limit).offset(offset)
    // .where({id_category: id})
  },
  async updateActive(id, value) {
    return await db("course")
      .where("id_course", id)
      .update({ active_course: value });
  },

  //tra ve cac khoa hoc cua nguoi dung da dang ki
  async findCourseRe(id) {
    return await db("registered_course").where("id_student", id);
  },
  async countCourseByTeacher(id_teacher) {
    return await db("course").where("id_teacher", id_teacher).count({ amount: "id_course" });
  },
  async countNumStudentByTeacher(id_teacher) {
    const sql = `select count(*) as count from course c, registered_course rc, user u
      where c.id_course = rc.id_course and u.id_user = c.id_teacher and u.id_user = `+ id_teacher + `
      `;
    const ret = await db.raw(sql);
    return ret[0];
  },
  async registerCourse(user) {
    await db("registered_course").insert(user);
  },
  async findReviewCourse(idCourse) {
    return db("review")
      .where("id_course", idCourse)
      .join("user", "id_user", "id_reviewer");
  },
  async findTeacherOfCourse(idTeacher) {
    return db("user").where("id_user", idTeacher);
  },
  async reviewCourse(review) {
    await db("review").insert(review);
  },
  async addWatchList(info) {
    await db("watch_list").insert(info);
  },
  async findWatchList(id_course, id_user) {
    return await db("watch_list")
      .where("id_course", id_course)
      .where("id_student", id_user);
  },
  async deleteWatchList(id_course, id_user) {
    await db("watch_list")
      .where("id_course", id_course)
      .where("id_student", id_user)
      .delete();
  },

  async findAllWatchList(id_user) {
    return await db("watch_list")
      .join("course", "course.id_course", "watch_list.id_course")
      .join("user", "course.id_teacher", "user.id_user")
      .where("id_student", id_user);
  },
  async addNewCourse(course) {
    return await db("course").insert(course);
  },
  async updateCourse(course, id_course) {
    console.log(course, id_course);
    return await db('course').where("id_course", id_course).update({
      name_course: course.name_course,
      tuition_fee: course.price,
      brief_description: course.briefDes,
      detailed_description: course.fullDes,
      id_category: course.catelv2,
      avatar: course.avatar
    })
  },
  async addNewLesson(lesson) {
    return await db("lesson").insert(lesson);
  },
  async updateLesson(lesson) {
    return await db("lesson").where("id_lesson", lesson.id_lesson).update({
      name_lession: lesson.name_lession,
      link_video: lesson.link_video
    })
  },

  convertLink(name_course) {
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

    return nameCourse;
  },

  async countCourse() {
    return await db("course").count("id_course as amount");
  },

  async countCourseNotActive() {
    return await db("course")
      .count("id_course as amount")
      .where("active_course", 0);
  },

  findCourseOfCategoryLv2: async (id) => {
    return await db("course").where({ id_category: id });
  },
  async updateReview(id_review, data) {
    return await db("review").where("id_review", id_review).update(data);
  },

  async findReview(id_user, id_course) {
    return await db("review").where("id_reviewer", id_user).where("id_course", id_course);
  }



};
