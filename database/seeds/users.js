
exports.seed = async function(knex) {
	await knex("users").truncate()
	await knex("users").insert([
		{ username: "user1", password:"pass1" },
		{ username: "user2", password:"pass2" },
		{ username: "user3", password:"pass3" },
		{ username: "user4", password:"pass4" },
	])
}
