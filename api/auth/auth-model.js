const db = require('../../data/dbConfig')

const getById = id => {
  return db('users')
    .where('id', id)
    .first()
}

const getBy = filter => {
  return db('users')
    .where(filter)
    .then(filtered => filtered)
}

const create = async user => {
  let created_id
  await db.transaction(async trx => {
    const [id] = await trx('users')
      .insert(user)
    created_id = id
  })
  return getById(created_id)
}

module.exports = {
  getById,
  getBy,
  create
}
