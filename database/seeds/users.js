exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { username: 'ben99', password: 'password' },
        { username: 'ben100', password: 'password' },
        { username: 'ben101', password: 'password' },
      ]);
    });
};
