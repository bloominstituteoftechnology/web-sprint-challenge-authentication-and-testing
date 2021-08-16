const db = require('../../data/db-config.js');

function find() {
  return db('users');
}

function findById(user_id) {
  return db('users')
    .where('user_id', user_id);
}

async function add({ username, password}) { 
    const [id] = await db('users').insert({ username, password});
  return findById(id);
}


module.exports = {
  add,
  find,
  findById,
};