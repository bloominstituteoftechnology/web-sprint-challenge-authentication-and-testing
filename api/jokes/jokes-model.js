const db = require('../../data/dbConfig')

const add = async (newUser) => {
    const [id] = await db('users').insert(newUser)
    return findByUserId(id)

}

const findUsers = () => {
    return db('users')
}

const findByUserName = (username) =>{
    return db('users')
            .select('*')
            .where('username', username)
            .first()
}

const findByUserId = (id) => {
    return db('users')
            .select('*')
            .where('id', id)
            .first()
}

function findBy(filter) {
    return db("users").where(filter).orderBy("id");
  }
  

module.exports = {
    add,
    findUsers,
    findByUserName,
    findByUserId,
    findBy
}
