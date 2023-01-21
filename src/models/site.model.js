import db from './../utilities/database.js';

export default {
    async add(entity) {
        return await db('course').insert(entity);
    },
    async countUser(){
        const sql = `select count(review.id_course) as countReview from course, review
        where course.id_course = review.id_course`
        const ret = await db.raw(sql);
        return ret[0][0].countReview;
    },
    async avgPoint(){
        const sql = `select avg(review.point) as pointReview from course, review
        where course.id_course = review.id_course`
        const ret = await db.raw(sql);
        return ret[0][0].pointReview;
    },
    async topMaxView(limit){
        // ,count(review.id_course) as count,avg(review.point) as avg
        // const sql = `select * from user ,course ,review , category_lv1 , category_lv2 
        // where course.id_teacher = user.id_user and category_lv2.id_category_lv2 = course.id_category and 
        // category_lv2.id_category_lv1 = category_lv1.id_category_lv1 and review.id_course = course.id_course
        // order by course.views desc
        // limit `+ limit
        // const ret = await db.raw(sql);
        // return ret[0];
        return await db("course")
        .select('*')
        .count('review.id_course AS count')
        .avg('review.point AS avg')
        .join('review', 'course.id_course', 'review.id_course')
        .groupBy(['course.id_course', 'course.name_course'])
        .where({'course.active_course':1})
        // .groupBy('course.id_course')
        .join('user', 'course.id_teacher', 'user.id_user')
        .join('category_lv2', 'category_lv2.id_category_lv2', 'course.id_category')
        // .join('category_lv1', 'category_lv2.id_category_lv1', 'category_lv1.id_category_lv1')
        .orderBy('views', 'desc')
        .limit(limit)
    },  

    async topNewestCourse(limit){
        return await db("course")
        .select('*')
        // .count('review.id_course AS count')
        // .avg('review.point AS avg')
        // .join('review', 'course.id_course', 'review.id_course')
        // .groupBy(['course.id_course', 'course.name_course'])
        // .join('user', 'course.id_teacher', 'user.id_user')
        // .join('category_lv2', 'category_lv2.id_category_lv2', 'course.id_category')
        // .join('category_lv1', 'category_lv2.id_category_lv2', 'category_lv1.id_category_lv1')
        .where({'course.active_course':1})
        .orderBy('course.creation_date', 'desc')
        .limit(limit)
    },
    async topCoursePopular(limit){
        return await db('course')
        .select('*')
        .count('review.id_course AS count')
        .avg('review.point AS avg')
        .join('review', 'course.id_course', 'review.id_course')
        .groupBy(['course.id_course', 'course.name_course'])
        .join('user', 'course.id_teacher', 'user.id_user')
        .where({'course.active_course':1})
        .join('category_lv2', 'category_lv2.id_category_lv2', 'course.id_category')
        // .join('category_lv1', 'category_lv2.id_category_lv2', 'category_lv1.id_category_lv1')
        .orderBy([
            { column: 'views',order: 'desc' }, 
            { column: 'avg', order: 'desc' }
          ])
        .limit(limit)
    },
    async topCategory(){
        // return await db('course')
        // .select('*')
        // .count('review.id_course AS countRe')
        // .avg('review.point AS avg')
        // .join('review', 'course.id_course', 'review.id_course')
        // .groupBy(['course.id_course', 'course.name_course'])
        // .join('user', 'course.id_teacher', 'user.id_user')
        // .join('category_lv2', 'category_lv2.id_category_lv2', 'course.id_category')
        // .join('category_lv1', 'category_lv2.id_category_lv2', 'category_lv1.id_category_lv1')
        // .orderBy('countRe', 'desc')
        // .limit(limit)
        const sql = `select c1.id_category_lv1, c1.avatar_category, c1.name_category_lv1, count(c.id_course) from course c, registered_course rc , category_lv2 c2, category_lv1 c1
        where c.id_course = rc.id_course and DATEDIFF( CURRENT_DATE, rc.registration_date) <= 7
        and c2.id_category_lv2 = c.id_category and c1.id_category_lv1 = c2.id_category_lv1
        group by c1.id_category_lv1,c1.avatar_category, c1.name_category_lv1
        order by count(c.id_course) DESC
        LIMIT 6
        ;`;
        const ret = await db.raw(sql);
        return ret[0];
    },
    async findAllCourse() {
        return await db('course')  //viết tắt của select(*) from course
        // .join('review', 'course.id_course', 'review.id_course')
        // .select('*')
        // .count('review.id_review')

        .select('*')
        .count('review.id_course AS count')
        .avg('review.point AS avg')
        .join('review', 'course.id_course', 'review.id_course')
        .groupBy(['course.id_course', 'course.name_course'])
        .join('user', 'course.id_teacher', 'user.id_user')
        .join('category_lv2', 'category_lv2.id_category_lv2', 'course.id_category')
        .join('category_lv1', 'category_lv2.id_category_lv2', 'category_lv1.id_category_lv1')
    },

    async findAllCourse2() {
        return await db('course')  //viết tắt của select(*) from course
    },

    async findById(id) {
        return await db('course').where('id_course', id);
    },

    async update(data) {
        const id_course = data.id_course;
        return await db('course').where('id_course', id_course).update(data);
    },
};

