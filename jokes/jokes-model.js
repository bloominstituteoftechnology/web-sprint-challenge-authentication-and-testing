const db = require('../database/dbConfig')

module.exports = {
    find,
    findById,
    findBy,
    CreateUser
}

function find() {
    return db('users')
}

function findById(id) {
    return db('users')
    .where ('id', id)
}

function findBy(username) {
    return db('users')
    .select('id','username','password')
    .where('username', username).first()
}

async function createUser(newUser) {
    const[id] = await db('users')
    .insert(newUser)
    return findById(id)
}