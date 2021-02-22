const db = require('../data/dbConfig');


module.exports = {
    insert,
    remove
}

async function insert(newMember){
    await db.insert(newMember).into('users');
}

async function remove(member){
    await db.remove(member).from('users');
}