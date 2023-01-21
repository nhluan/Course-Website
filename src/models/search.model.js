import db from "../utilities/database.js"

export default {
    async searchByCourse(sort, course, limit, offset) {
        let sql;
        if (course == "")
            sql = `select* from course c 
            where c.active_course = 1
            order by c.`+ sort + ` DESC
            limit `+ limit + ` offset ` + offset;
        else
            sql = `select *from course c, category_lv1 c1, category_lv2 c2
            where c.id_category = c2.id_category_lv2 and c2.id_category_lv1 = c1.id_category_lv1 
           and c.active_course = 1
           and (MATCH(c.name_course, c.brief_description,c.detailed_description) AGAINST (\'`+ course + `\')
           or match(c1.name_category_lv1) AGAINST (\'`+ course + `\')
           or match(c2.name_category_lv2) AGAINST (\'`+ course + `\'))
            order by c.`+ sort + ` DESC
            limit `+ limit + ` offset ` + offset;
        const ret = await db.raw(sql);
        return ret[0];
    },
    async countByCourse(course) {
        let sql;
        if (course == "")
            // sql = db("course");
            sql = `select count(*) as count from course c where c.active_course = 1`;
        else
            sql = `select count(*) as count from course c, category_lv1 c1, category_lv2 c2
        where c.id_category = c2.id_category_lv2 and c2.id_category_lv1 = c1.id_category_lv1
        and c.active_course = 1
        and (MATCH(c.name_course, c.brief_description,c.detailed_description) AGAINST (\'`+ course + `\')
        or match(c1.name_category_lv1) AGAINST (\'`+ course + `\')
        or match(c2.name_category_lv2) AGAINST (\'`+ course + `\')
        )`;
        const ret = await db.raw(sql);
        return ret[0];
    },
}

