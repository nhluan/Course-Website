import db from "../utilities/database.js";

export default {
  add(entity) {
    return db("reset_password_user").insert(entity);
  },
  async deleteAllUser() {
    await db("reset_password_user").del();
  },
  async findByEmail(email) {
    return await db("reset_password_user").where("email", email);
  },
  async deleteByEmail(email) {
    return await db("reset_password_user").where("email", email).del();
  },
  // async deleteUserById(id) {
  //   await db("verify_user").delete().where("id_user", id);
  // },
};
