exports.seed = function(knex,) {
return knex('users')
    .truncate()
    .then(function() {
return knex('users').insert([
    { username: 'naruto', password: 'password87'},
    { username: 'luffy', password: '00pirateking00'},
    { username: 'ichigo', password: 'number1bankai'},
]);
});
}