const router = require('express').Router();
const bcrypt = require("bcryptjs"); //step one 
const Users = require("../user/user-model")
router.post('/register', (req, res) => {
  // implement registration with bcrypt
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  Users.add(user)
    .then((saved) => {
      res.status(201).json(saved)
    })
    .catch(() => {
      res.status(500).json(error)
    })
});

router.post('/login', (req, res) => {
  // implement login
});

module.exports = router;
