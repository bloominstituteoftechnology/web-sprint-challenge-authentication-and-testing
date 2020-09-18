const db = require('../database/dbConfig')

module.exports = {
    add,
    findById,
    findBy
}

async function add(user) {
    try {
        const [id] = await db("users").insert(user, "id");

        return findById(id);
    } catch (error) {
        throw error;
    }
}

function findById(id) {
    return db("users").where({ id }).first();
}

function findBy(filter) {
    return db("users as u")
        .where(filter)
        .orderBy("u.id")
        .select("u.id", "u.username", "u.password");
}