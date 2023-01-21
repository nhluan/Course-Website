import db from "../utilities/database.js";

export default {
    addUser(entity) {
        return db("user").insert(entity).returning("*");
    },
    async updateStatus(email) {
        return await db("user").where("email", email).update({verified: 1});
    },
    async updatePassword(email, password) {
        return await db("user")
            .where("email", email)
            .update({password: password});
    },
    async deleteAllUser() {
        return await db("user").del();
    },
    async deleteUserById(id) {
        return await db("user").delete().where("id_user", id);
    },
    async findByEmailUser(email) {
        return await db("user").where("email", email);
    },
    async findUserById(id) {
        return await db("user").where("id_user", id);
    },
    async findAllUser() {
        return await db("user");
    },
    async findAllUserTeacher() {
        return await db("user").where("role", 1);
    },
    async findAllUserStudent() {
        return await db("user").where("role", 2);
    },
    async updateUser(id_user, data) {
        return await db("user").where("id_user", id_user).update(data);
    },
    async updateActive(id_user, value) {
        return await db("user").where("id_user", id_user).update({active: value});
    },
    async countUserTeacher() {
        return await db("user").where({role: 1}).count({amount: "id_user"});
    },
    async countUserStudent() {
        return await db("user").where({role: 2}).count({amount: "id_user"});
    },
    async inforUser(id_user) {
        return await db("user").where("id_user", id_user);
    },

    async updateProfileUser(data, email) {
        return await db("user").where("email", email).update(data);
    }


};
