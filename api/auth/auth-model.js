  
const db = require('../database/dbConfig');

function getUserBy(filter){
    return db('users').select(
        'id',
        'username',
        'password'
    )
    .where(filter)
    .first();
}
function getUserID(id){
    return db('users').where('id', id)
}

async function addUser(user){
    const [id] = await db('users').insert(user);
    return getUserID(id);
}

module.exports = {
    getUserBy,
    addUser
}