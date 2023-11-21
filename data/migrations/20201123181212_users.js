exports.up = async function (knex) {

    await knex.schema.createTable('users', users => {
      users.increments();
      users.string('username', 255).notNullable().unique();
      users.string('password', 255).notNullable();
    });

    await knex.schema.createTable('jokes', table => {
      table.increments('db_id')
      table.string('id').notNullable()
      table.string('joke', 400).notNullable().unique()
    })
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('jokes');
};
