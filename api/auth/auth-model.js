const db = require('../../data/dbConfig.js');

function findById(id) {
    return db("users").where({ id }).first()
  }

function findBy(filter) {
    return db("users").where(filter).orderBy("id")
}
  

async function add(user){
    const [id] = await db('users').insert(user, "id")
    return findById(id)
}

module.exports = {
    findById,
    findBy,
    add
}