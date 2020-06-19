let db = require('../database/dbConfig');

async function create(user) {
    try {
      const [id] = await db("users").insert(user, "id"); // returns id from new user
  
      return findById(id);// uses findById to return the user
    } catch (error) {
      throw error; // gives back error if error is found
    }
  }
  
  function findById(id) {
    return db("users").where({ id }).first().select("id", "username"); // made it to return only id and username
  }

  function findBy(username) {
    return db("users as u")
        .select("u.id", "u.username", "u.password")
        .where(username)
        .orderBy("u.id");
  }

  module.exports = {
      create,
      findById,
      findBy,
  }