const db = require('../../data/dbConfig'); 

const addUser = (user) => {
  return db('users').insert(user); 
};

const getAll = () => {
  return db('users'); 
}; 
module.exports = {
  addUser,
  getAll
};