import db from "./../utilities/database.js";

export default {
  async findAll() {
    return await db("course"); //viết tắt của select(*) from course
  },
  addCategoryLv1: async (entity) => {
    return await db("category_lv1").insert(entity);
  },

  addCategoryLv2: async (entity) => {
    return await db("category_lv2").insert(entity);
  },

  async findCoursesCategoriesLevel1(id) {
    return await db("category_lv1")
      .join(
        "category_lv2",
        "category_lv1.id_category_lv1",
        "category_lv2.id_category_lv2"
      )
      .select("*")
      .where({ id_category_lv2: id,'course.active_course':1 })
      .join("course", "course.id_category", "category_lv2.id_category_lv2")
      .count("review.id_course AS count")
      .avg("review.point AS avg")
      .join("review", "course.id_course", "review.id_course")
      .groupBy(["course.id_course", "course.name_course"])
      .join("user", "course.id_teacher", "user.id_user");
    // .where({id_category: id})
  },
    async countByIdLv1(id) {
        const sql = `select count(course.id_course) as amount from course, category_lv2,category_lv1
        where course.id_category = category_lv2.id_category_lv2 and course.active_course = 1 and category_lv2.id_category_lv1 = category_lv1.id_category_lv1 and category_lv1.id_category_lv1 = `+id
        const ret = await db.raw(sql);
        return ret[0][0].amount;
        // const list =  await db("course")
        // .join('category_lv2', 'course.id_category', 'category_lv2.id_category_lv2')
        // // .select('*')
        // .join('category_lv1','category_lv2.id_category_lv2', 'category_lv1.id_category_lv1', )
        // .where("category_lv1.id_category_lv1", id)
        // .count({amount: 'course.id_course'})
        // return list[0].amount
      },
      async countByIdLv2(id) {
        const sql = `select count(course.id_course) as amount from course, category_lv2
        where course.id_category = category_lv2.id_category_lv2 and course.active_course = 1 and category_lv2.id_category_lv2 = `+id
        const ret = await db.raw(sql);
        return ret[0][0].amount;
        // const list =  await db("course")
        // .join('category_lv2', 'course.id_category', 'category_lv2.id_category_lv2')
        // // .select('*')
        // .join('category_lv1','category_lv2.id_category_lv2', 'category_lv1.id_category_lv1', )
        // .where("category_lv1.id_category_lv1", id)
        // .count({amount: 'course.id_course'})
        // return list[0].amount
      },
    
    async findCoursesCategoriesLevel1(id,limit,offset) {
        return await db('category_lv1')
        .join('category_lv2', 'category_lv1.id_category_lv1', 'category_lv2.id_category_lv1')
        .select('*')
        .join('course', 'course.id_category', 'category_lv2.id_category_lv2')
        .where({'category_lv1.id_category_lv1': id,'course.active_course':1})
        // .count('review.id_course AS count')
        // .avg('review.point AS avg')
        // .join('review', 'course.id_course', 'review.id_course')
        .groupBy(['course.id_course', 'course.name_course'])
        .join('user', 'course.id_teacher', 'user.id_user')
        .limit(limit).offset(offset)
        // .where({id_category: id})
    },

    async findCoursesCategoriesLevel2Son(id,name,limit,offset) {
        return await db('category_lv2')
        .select('*')
        .where({
          // 'category_lv2.id_category_lv2': id,
          // 'category_lv2.name_category_lv2':  name
          id_category_lv2:id,
          name_category_lv2: name

          })
        .join('course', 'course.id_category', 'category_lv2.id_category_lv2')
        // .count('review.id_course AS count')
        // .avg('review.point AS avg')
        // .join('review', 'course.id_course', 'review.id_course')
        .groupBy(['course.id_course', 'course.name_course'])
        .join('user', 'course.id_teacher', 'user.id_user')
        .limit(limit).offset(offset)
    },

  async findCoursesCategoriesLevel2(id) {
    return await db("category_lv2")
      .join("course", "course.id_category", "category_lv2.id_category_lv2")
      .select("*")
      .where({ id_category: id })
      .count("review.id_course AS count")
      .avg("review.point AS avg")
      .join("review", "course.id_course", "review.id_course")
      .groupBy(["course.id_course", "course.name_course"])
      .join("user", "course.id_teacher", "user.id_user")
      .join(
        "category_lv1",
        "category_lv1.id_category_lv1",
        "category_lv2.id_category_lv1"
      );
  },
  findCategoryLv1ById: async (id) => {
    return await db("category_lv1").where({ id_category_lv1: id });
  },
  async findCategoryLv1() {
    return await db("category_lv1");
  },

  async findCategoryLv2() {
    return await db("category_lv2");
  },
  findAllCategory: async () => {
    return await db("category_lv1").join("category_lv2", {
      "category_lv1.id_category_lv1": "category_lv2.id_category_lv1",
    });
  },
  updateCategoryLv1: async (id, entity) => {
    return await db("category_lv1")
      .where({ id_category_lv1: id })
      .update(entity);
  },
  updateCategoryLv2: async (id, entity) => {
    return await db("category_lv2")
      .where({ id_category_lv2: id })
      .update(entity);
  },
  deleteCategoryLv1: async (id) => {
    return await db("category_lv1")
      .returning("*")
      .where({ id_category_lv1: id })
      .del();
  },
  deleteCategoryLv2: async (id) => {
    return await db("category_lv2").where({ id_category_lv2: id }).del();
  },

  findCategoryLv2ByLv1: async (id) => {
    return await db("category_lv2").where({ id_category_lv1: id });
  },
  findCategoryLv2ById: async (id) => {
    return await db("category_lv2").where({ id_category_lv2: id });
  }
};
