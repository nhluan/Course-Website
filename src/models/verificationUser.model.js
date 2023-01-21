import db from "../utilities/database.js";

export default {
  add(entity) {
    return db("verify_user").insert(entity);
  },
  async deleteAllUser() {
    await db("verify_user").del();
  },
  async findByEmail(email) {
    return await db("verify_user").where("email", email);
  },
  async deleteByEmail(email) {
    return await db("verify_user").where("email", email).del();
  },
  // async deleteUserById(id) {
  //   await db("verify_user").delete().where("id_user", id);
  // },
};
