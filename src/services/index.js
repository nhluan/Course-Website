import db from "../utilities/database.js";

export default {
  async find() {
    const sql = `SELECT id_category FROM category;`;
    const ret = await db.raw(sql);

    console.log(ret[0]);

    // const list = await db('category').where('id_category', '01');
    // console.log(list)
    // return list;
  },
};
