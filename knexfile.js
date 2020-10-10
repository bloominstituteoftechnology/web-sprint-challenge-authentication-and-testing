module.exports = {
  development: {
    client: 'sqlite3',
    connection: { filename: './database/auth.db3' },
    useNullAsDefault: true,
    migrations: {
      directory: './database/migrations',
      tableName: 'dbmigrations',
    },
    seeds: { directory: './database/seeds' },
  },
  testing:{
    client: 'sqlite3',
    connection: {
      filename: './tests/test.db3',
    },
    useNullAsDefault: true,
    migrations: { directory: "./tests/migrations"},
    seeds: { directory: "./tests/seeds"},
  },
};
