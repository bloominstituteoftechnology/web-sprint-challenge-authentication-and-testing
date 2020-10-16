const db = require('../database/dbConfig');

module.exports = {
    add,
    getById,
    getBy
};

async function add(body) {
    try {
        const [id] = await db("users").insert(body, "id");
        return getById(id);
    } catch (error) {
        throw error;
    };
};

function getById(id) {
    return db("users").where({ id }).first();
};

function getBy(filter){
    return db('users')
        .where(filter)
        .first()
};