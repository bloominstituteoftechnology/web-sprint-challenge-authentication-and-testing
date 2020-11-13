const db = require('../database/dbConfig')

const get = async () => {
  return db('user')
}

const getBy = async filter => {
  return db('user')
  .where(filter)
  .orderBy('id')
}

const getById = async id => {
  return db('user')
  .where({ id })
  .first()
}

const create = async user => {
  const [id] = await db('user')
  .insert(user)
  return getById(id)
}

module.exports = {
  get,
  getBy,
  create,
  getById,
}