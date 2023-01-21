import db from './../utilities/database.js';

export default {
    async add(entity) {
        return await db('sessions').insert(entity);
    },

    async findAll() {
        return await db('sessions');
    },

    async deleteAll() {
        return await db('sessions').del();
    },
    async findById(id) {
        return await db('sessions').where('id_sessions', id);
    },

    async update(data) {
        const id_sessions = data.id_sessions;
        return await db('sessions')
            .where('id_sessions', id_sessions)
            .update(data);
    },
};
// db('students').insert(req.body)
// .then((newUser) => {
//     res.json({newUser});
//   })
//   .catch((e)=>console.log(e));
