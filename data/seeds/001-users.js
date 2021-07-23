exports.seed = function(knex, Promise) {
    return knex('users')
      .truncate()
      .then(function() {
        return knex('users').insert([
          { username: 'sam', password: '1234'},
          { username: 'jim', password: 'abcd'},
          { username: 'brent', password: 'ab12'},
          { username: 'bill', password: '12ab'},
        ]);
      });
  };