const db = require("../database/dbConfig");

module.exports = {
  add,
  find,
  findBy,
  findById,
};

function find() {
  return db("jokes").select("id", "username").orderBy("id");
}

function findBy(filter) {
  return db("jokes").where(filter).orderBy("id");
}

async function add(user) {
  try {
    const [id] = await db("jokes").insert(user, "id");

    return findById(id);
  } catch (error) {
    throw error;
  }
}

function findById(id) {
  return db("jokes").where({ id }).first();
}
