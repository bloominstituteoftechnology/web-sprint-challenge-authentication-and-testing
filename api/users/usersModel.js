const db = require("../../data/dbConfig");

function getAll() {
  return db("users");
}

function getById(id) {
  return db("users").where({ id }).first();
}

async function insert(user) {
  const [id] = await db("users").insert(user);
  return getById(id);
}

async function update(id, changes) {
  await db("users").where({ id }).update(changes);
  return getById(id);
}

function remove(id) {
  return db("users").where({ id }).del();
}

module.exports = {
  getAll,
  getById,
  insert,
  update,
  remove,
};
