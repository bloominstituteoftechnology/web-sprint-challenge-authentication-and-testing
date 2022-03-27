const db = require('../data/dbConfig')

function findByUsername(username) {
    return db('users').where('username', username).first()
}

async function add(user) {
    const [id] = await db('users').insert(user)
    return findByUsername(username)
}

module.exports = {
    findByUsername,
    add
}