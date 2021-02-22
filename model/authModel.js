const db = require('../data/dbConfig');


module.exports = {
    insert,
    remove,
    getBy
}

async function insert(newMember){
    return await db.insert(newMember).into('users');
}

async function remove(member){
    return await db.remove(member).from('users');
}

async function getBy(filter){
    return await db('users').where({username: filter}).orderBy('id');
}