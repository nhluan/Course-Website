import testAPIModel from "./../models/testAPI.model.js";
import siteModel from "../models/site.model.js";

import moment from "moment";
import courseModel from "../models/course.model.js";
class SiteController {
  async index(req, res) {
    const limitMaxView = 10;
    const limitNewest = 10;
    const limitPopular = 4;
    let top10CourseMaxViewOrigin = await siteModel.topMaxView(limitMaxView);
    let top10NewestCourseOrigin = await siteModel.topNewestCourse(limitNewest);
    console.log(top10NewestCourseOrigin);
    let topPopularOrigin = await siteModel.topCoursePopular(limitPopular);
    let topCategoryOrigin = await siteModel.topCategory();

    // console.log(top10CourseMaxViewOrigin); 

    const date1 = new Date(); //current date
    const topPopular = [...topPopularOrigin].map((obj) => {
      return {
        ...obj,
        creation_date: moment(obj.creation_date).format("YYYY/MM/DD "),
        avg: Math.round(parseFloat(obj.avg) * 100) / 100,
        tuition_fee: obj.tuition_fee.toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        }),
      };
    });
    const topPopularInWeek = [];
    topPopular.forEach((course, index) => {
      const date2 = new Date(course.creation_date);
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      course.isRight = (index + 1 === 1|| index + 1 === 6) ? true : false
      if (diffDays <= 70) {
        topPopularInWeek.push(course);
      }
    });
    let top10CourseMaxView = [...top10CourseMaxViewOrigin].map(
      (obj, index) => {
        // console.log(index+1);
        return {
          ...obj,
          creation_date: moment(obj.creation_date).format("YYYY/MM/DD "),
          avg: Math.round(parseFloat(obj.avg) * 100) / 100,
          tuition_fee: obj.tuition_fee.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          }),
          isRight: (index + 1 === 1|| index + 1 === 6) ? true : false,
        };
      }
    );
    
    let top10NewestCourse = [...top10NewestCourseOrigin].map((obj, index) => {
      return {
        ...obj,
        creation_date: moment(obj.creation_date).format("YYYY/MM/DD "),
        avg: Math.round(parseFloat(obj.avg) * 100) / 100,
        tuition_fee: obj.tuition_fee.toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        }),
        isRight: (index + 1 === 1|| index + 1 === 6) ? true : false,
      };
    });
    // console.log(top10CourseMaxView.length);
    let resMaxView1 = null,
      resMaxView2 = null;
    if (top10CourseMaxView.length > 5) {
      resMaxView1 = top10CourseMaxView.slice(0, 5);
      resMaxView2 = top10CourseMaxView.slice(5, 10);
    }
    let resNewView1 = null,
      resNewView2 = null;
    if (top10NewestCourse.length > 5) {
      resNewView1 = top10NewestCourse.slice(0, 5);
      resNewView2 = top10NewestCourse.slice(5, 10);
    }
    // console.log(topPopularInWeek);
    res.render("home", {
      // courses: data,
      resMaxView1: resMaxView1 || top10CourseMaxView,
      resMaxView2: resMaxView2 || top10CourseMaxView,
      resNewView1: resNewView1 || top10NewestCourse,
      resNewView2: resNewView2 || top10NewestCourse,
      trendingCourse: topPopularInWeek,
      categoryTrending: topCategoryOrigin,
      // empty: data.length === 0,
    });
  }

  async checkSession(req, res) {
    await testAPIModel
      .findAll()
      .then((data) => {
        res.json({ data });
      })
      .catch((e) => res.json(e));
  }
  async deleteAllSession(req, res) {
    await testAPIModel
      .deleteAll()
      .then((data) => {
        res.json({ data });
      })
      .catch((e) => res.json(e));
  }
}

export default new SiteController();
