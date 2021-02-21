const db = require('../../data/dbConfig.js')

module.exports = {
    getUser,
    findByUsername,
    findById,
    createUser
}

function getUser() {
return db('users');
}

function findByUsername(username) {
return db('users').where({username}).first();
}

function findById(id) {
return db('users').where({id});
}

async function createUser(user) {
    const [id] = await db('users').insert(user);
    return findById(id).first();
}