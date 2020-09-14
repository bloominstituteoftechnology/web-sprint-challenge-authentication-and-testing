const db = require("../database/dbConfig");

async function add(user){
    const [id] = await db("users").insert(user)
    return findById(id);
}

function find(){
    return db("users").select("id", "username")
}

function findById(id) {
    return db("users")
        .select("id", "username")
        .where({ id })
        .first()
}

function findBy(filter) {
    return db("users")
        .select("id", "username")
        .where(filter)
}

function findByUsername(username){
    return db('users')
        .select('id','username','password')
        .where(username)
}

module.exports = {
    add,
    find,
    findBy,
    findById,
    findByUsername
}
