const db = require('../../data/dbConfig');

function find() {
  return db('users');
}

function findById(user_id) {
  return db('users')
    .where('id', user_id);
}

function findBy(filter) {
  return db('users')
    .select('id', 'username',  'password')
    .where(filter);
}

async function add({ username, password}) { 
    const [id] = await db('users').insert({ username, password});
  return findById(id);
}


module.exports = {
  add,
  find,
  findBy,
  findById,
};