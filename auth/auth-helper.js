const db = require('../database/dbConfig')

async function register(user){
    return db("users").insert(user)
    .then(id =>{
        return findById(id[0])
    })
    .catch(
        err=> {return err}
    )
}

async function findById(id){
    return db("users").where({id}).first()
}
function findBy(filter){
    return db("users").where({"username" : filter}).first()
}

module.exports = {register, findBy}