const db = require('../database/dbConfig'); 

module.exports = {
    add, 
    findBy
}

function findById(id){
    return db('users')
        .where({ id })
        .first(); 
}

function findBy(username){
    return db('users')
        .where({ username })
        .first(); 
}

function add(user){
    return db('users')
        .insert(user, 'id')
            .then(([id]) => {
                return findById(id); 
            }); 
}