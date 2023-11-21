const jokes = require('../../api/jokes/jokes-data')

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').truncate()
  await knex('jokes').truncate()
  await knex('jokes').insert(jokes);
};
