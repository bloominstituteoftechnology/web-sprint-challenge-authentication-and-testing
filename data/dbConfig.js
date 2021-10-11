// do not make changes to this file
const knex = require("knex");
const knexConfig = require("../knexfile.js");
const environment = process.env.DB_ENV || "testing";

module.exports = knex(knexConfig[environment]);
