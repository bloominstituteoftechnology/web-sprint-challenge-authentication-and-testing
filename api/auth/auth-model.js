const db = require('../../data/dbConfig');

function findBy(filter) {
    return db('users')
        .select('id', 'username', 'password')
        .where(filter)
}

function findById(id) {
    return db('users')
        .select('id','username','password')
        .where("id", id)
        .first()
}

async function add({ username, password }) {
    const [id] = await db('users').insert({ username, password })
    return findById(id)
}

module.exports = {
    findBy,
    findById,
    add,
};