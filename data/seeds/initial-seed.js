const jokes = require('../../api/jokes/jokes-data')
const bcrypt = require('bcryptjs')

const password = bcrypt.hashSync('1234', 8)

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('jokes').truncate()
  await knex('jokes').insert(jokes);

  await knex('users').truncate()
  await knex('users').insert({username: 'hello', password: password})
};
