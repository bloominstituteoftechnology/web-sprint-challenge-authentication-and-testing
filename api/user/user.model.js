const db = require('../../data/dbConfig.js');

const findBy = filter => {
	return db('users').where(filter).first();
};

const findById = id => {
	return db('users').where({ id }).first();
};

async function addUser({ username, password }) {
	const [user_id] = await db('users').insert({
		username: username,
		password: password
	});
	return findById(user_id);
}

module.exports = { findBy, findById, addUser };