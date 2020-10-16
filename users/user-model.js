const db = require('../database/dbConfig');

module.exports = {
    add,
    getById
}

async function add(body) {
    try {
        const [id] = await db("users").insert(body, "id");

        return getById(id);
    } catch (error) {
        throw error;
    }
}

function getById(id) {
    return db("users").where({ id }).first();
}