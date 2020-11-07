const db = require("../database/dbConfig")

async function add(user) {
  await db("users").insert(user)
}

function findByUsername(username) {
  return db("users as u").where("u.username", username).first()
}

module.exports = {
  add,
  findByUsername,
}