const router = require("express").Router();

const Users = require("./users-model.js");
const restrict = require("../middleware/restricted");


router.get("/", restrict, (req, res, next) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(next); // our custom err handling middleware in server.js will trap this
});

module.exports = router;