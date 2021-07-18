const db = require("../data/dbConfig.js");

async function add(newUser) {
    const [id] = await db("users as u").insert(newUser)
    return findByUserId(id)
}

function findUsers() {
    return db("users")
}

function findByUserName(username) {
    return db("users as u")
        .where("username", username)
        .select("*")
}

function findByUserId(id) {
    return db("users as u")
        .where("id", id)
        .select("*").first()
}



module.exports = {
    add,
    findUsers,
    findByUserName,
    findByUserId,
}