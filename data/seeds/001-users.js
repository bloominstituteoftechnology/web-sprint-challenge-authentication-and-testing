exports.seed = function(knex, Promise) {
  return knex('users')
    .truncate()
    .then(function() {
      return knex('users').insert([
        { username: 'Brian', password: '1234'},
        { username: 'Jane', password: 'abcd'},
        { username: 'Donovan', password: 'ab12'},
        { username: 'Patrick', password: '12ab'},
      ]);
    });
}; 
