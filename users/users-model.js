module.exports = {
  add,
  find,
  findBy,
  findById,
};
const db = require("../database/dbConfig");

function add(newUser) {
  return db("users")
    .insert(newUser)
    .then((ids) => {
      const id = ids[0];

      return findById(id);
    });
}
function find() {
  return db("users").select("id", "username");
}
function findById(id) {
  return db("users").where({ id });
}
function findBy(filter) {
  return db("users").where(filter);
}
