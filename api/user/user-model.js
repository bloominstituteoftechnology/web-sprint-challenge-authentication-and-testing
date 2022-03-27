const db = require('../../data/dbConfig')

function findByUsername(username) {
return db('users').where({username}).first()
}

async function add(user) {
    const [id] = await db('users').insert(user)
    return db('users').where({id}).first()
}

module.exports = {
    findByUsername,
    add
}