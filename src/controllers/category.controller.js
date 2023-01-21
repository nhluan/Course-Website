import categoryModel from "../models/category.model.js";
class CategoryController {
  async categoryCourseLevel1(req,res){
    const id = req.query.id || 0
    const name = req.query.name
    
    const limit = 3
    const page = req.query.page || 1
    const offset = (page - 1) * limit
    const totalCourses = await categoryModel.countByIdLv1(id)
    // console.log(totalCourses);
    let nPages = Math.floor(totalCourses/limit)
    if(totalCourses%limit > 0 ) nPages++

    const pageNumber = []
    for(let i = 1;i<=nPages;i++){
      pageNumber.push({
        value: i,
        isCurrent: +page === i,
      })
    }
    const isFirst = (+page === 1)
    const isLast = (+page === nPages)

    
    await categoryModel
      .findCoursesCategoriesLevel1(id,limit,offset)
      // .findCoursesCategoriesLevel1(id,limit,offset)
      .then((dataRaw) => {
        const data = dataRaw.map((obj)=>{
          return {...obj, tuition_fee: obj.tuition_fee.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}
        })
        // console.log(data);
        res.render("categoryCourses", {
          courses: data,
          name: name,
          empty: data.length === 0,
          pageNumber: pageNumber,
          isFirst:isFirst,
          isLast: isLast
        });
        // console.log(data);
      })
      .catch((e) => console.log(e));
      // console.log(data);
  }

  async categoryCourseLevel2(req,res){
    // console.log(req.params);
    const id = req.query.id2 || 0
    const name = req.query.name
    // console.log(name)
    
    const limit = 3
    const page = req.query.page || 1
    const offset = (page - 1) * limit
    const totalCourses = await categoryModel.countByIdLv2(id)
    // console.log(totalCourses);
    let nPages = Math.floor(totalCourses/limit)
    if(totalCourses%limit > 0 ) nPages++

    const pageNumber = []
    for(let i = 1;i<=nPages;i++){
      pageNumber.push({
        value: i,
        isCurrent: +page === i,
      })
    }
    const isFirst = (+page === 1)
    const isLast = (+page === nPages)

    await categoryModel
      .findCoursesCategoriesLevel2Son(id,name,limit, offset)
      .then((dataRaw) => {
        const data = dataRaw.map((obj)=>{
          return {...obj, tuition_fee: obj.tuition_fee.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}
        })
        res.render("categoryCourses", {
          courses: data,
          name: name,
          empty: data.length === 0,
          pageNumber: pageNumber,
          isFirst:isFirst,
          isLast: isLast
        });
        // console.log(data);
      })
      .catch((e) => console.log(e));
    // console.log(data);
  }

  async findAll(req, res) {
    await categoryModel
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
}

export default new CategoryController();
