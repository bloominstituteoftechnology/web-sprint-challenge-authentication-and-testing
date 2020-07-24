exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        { id: 1, username: "david", password: "david" },
        { id: 2, username: "briana", password: "briana" },
        { id: 3, username: "mark", password: "mark" },
      ]);
    });
};
