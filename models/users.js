const db = require('../database/dbConfig');

const get = async () => {
  return db('users');
};

const getBy = async filter => {
  return db('users').where(filter).orderBy('id');
};

const getById = async id => {
  return db('users').where({ id }).first();
};

const create = async user => {
  const [id] = await db('users').insert(user);
  return getById(id);
};

module.exports = {
  get,
  getBy,
  create,
  getById,
};
