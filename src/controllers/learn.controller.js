import courseModel from "../models/course.model.js";
class LearnController {
  //GET :id
  async showLesson(req, res) {
    console.log(req.params);
    const currentLesson = await courseModel
      .findLessonById(req.params.id_course, req.params.id_lesson)
      .then((data) => data)
      .catch((e) => console.log(e));
    const fullLesson = await courseModel
      .findAllLessonByIdCourse(req.params.id_course)
      .then((data) => data)
      .catch((e) => console.log(e));

    // console.log("Full lesson: ", fullLesson);

      // console.log(currentLesson);
    const sizeLesson = fullLesson.length;
    // console.log(sizeLesson);
    // console.log(fullLesson.length);
    res.render("progressCourse", {
      currentLesson: currentLesson,
      fullLesson: fullLesson,
      sizeLesson: sizeLesson,
    });
  }
}

export default new LearnController();
