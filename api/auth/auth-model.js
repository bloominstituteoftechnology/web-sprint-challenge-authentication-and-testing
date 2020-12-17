const db = require('../../data/dbConfig'); 

const addUser = async (user) => {
  const [id] = await db('users').insert(user); 
  return db('users').where({id}).first();
};

const getAll = () => {
  return db('users'); 
}; 

const findBy = (filter) => {
  return db('users').where(filter).first();
}
module.exports = {
  addUser,
  getAll, 
  findBy
};