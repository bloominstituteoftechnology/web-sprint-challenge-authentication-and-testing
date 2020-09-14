
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
          {id: 1, username: 'rowValue1', password:'testing1'},
          {id: 2, username: 'rowValue2', password:'testing12fasa'},
          {id: 3, username: 'rowValue3', password:'testing1!!@'},
      ]);
    });
};
