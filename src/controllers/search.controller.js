import searchModel from "../models/search.model.js";
import courseModel from "../models/course.model.js";
class SearchController {
  async searchCourse(req, res) {
    const rating = req.query.rating || "";
    const lang = req.query.lang || "";
    const duration = req.query.duration || "";
    const price = req.query.price || "";
    const sort = req.query.sort || "views";

    const curPage = req.query.page || 1;
    const limit = 4;
    const offset = (curPage - 1) * limit;
    const course_search = req.params.course_search || "";
    let checkAllCourse;
    if (course_search == "") {
      checkAllCourse = true;
    }
    
    const count = await searchModel.countByCourse(course_search);
    let count_course = await searchModel.searchByCourse(sort, course_search,count[0].count , 0);
    if (rating != "") {
      count_course = count_course.filter(function (value) {
        return value.point >= rating;
      })
    }
    const total = count_course.length;
    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++

    const pageNumbers = [];
    for (let i = 1; i <= nPages; i++) {
      pageNumbers.push({
        value: i,
        isCurrent: +curPage === i,
      })
    }

    const isFirst = (+curPage === 1)
    const isLast = (+curPage === nPages)

    await searchModel
      .searchByCourse(sort, course_search, limit, offset)
      .then((data) => {
        let newData = data;
        if (rating != "") {
          newData = newData.filter(function (value) {
            return value.point >= rating;
          })
        }
        // if(lang!=""){
        //   newData = data.filter(function (value) {
        //     return value.lang == lang;
        //   })
        // }
        // if(duration!=""){

        // }
        // if(price!=""){

        // }


        res.render("search", {
          course_search: course_search,
          checkAllCourse: checkAllCourse,
          courses: newData,
          rating: rating,
          lang: lang,
          duration: duration,
          price: price,
          length: total,
          pageNumber: pageNumbers,
          isFirst: isFirst,
          isLast: isLast,
          sort: sort
        })
      })
      .catch((e) => console.log(e));
  }
}
export default new SearchController();