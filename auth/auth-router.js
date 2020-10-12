const router = require('express').Router();
const bcrypt = require("bcryptjs"); //step one 
const Users = require("../user/user-model")
const jwt = require("jsonwebtoken")
const { jwtSecret } = require("../config/secret")

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
  // implement login with JSON web tokens
  let { username, password } = req.body
  Users.findBy({ username })
    .first()
    .then((user) => {
      if (user && bcrypt.hashSync(password), user.password) {
        const token = generateToken(user);// get a token
        res.status(200).json({
          message: `Welcome ${user.username}`,
          token //send the token
        })
      } else {
        res.status(401).json({ message: 'Invalid credentials' })
      }
    })
    .catch(err => {
      res.status(500).json(err)
    })
});

module.exports = router;
