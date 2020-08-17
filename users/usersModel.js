const db = require('../database/dbConfig.js')

function find() {
   return db('users')
}

function findBy(filter) {
   return db('users')
    .where(filter)
}

function add(user) {
   return db('users')
    .insert(user)
}

module.exports = {
   find,
   findBy,
   add
}