const db = require('../../data/dbConfig');

function find() {
    return db('users')
}

function findById(id) {
    return db('users')
        .where('user.id', id)
        .first()
}

function findByUsername(username) {
    return db('users')
        .where('username', username)
}

function validatePassword(password) {
    return db('users')
        .where('password', password)
}

async function add(user) {
    const [id] = await db('users').insert(user)
    return findById(id)
}

module.exports = {
    find,
    findById,
    findByUsername,
    validatePassword,
    add,
}