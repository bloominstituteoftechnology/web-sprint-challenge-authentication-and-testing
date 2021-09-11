const router = require('express').Router();
const { jwtSecret } = require("../../config/secrets.js");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { checkUsername } = require("../middleware/auth-middleware.js");
const User = require("./auth-model");
/*
  IMPLEMENT
  You are welcome to build additional middlewares to help with the endpoint's functionality.
  DO NOT EXCEED 2^8 ROUNDS OF HASHING!

  1- In order to register a new account the client must provide `username` and `password`:
    {
      "username": "Captain Marvel", // must not exist already in the `users` table
      "password": "foobar"          // needs to be hashed before it's saved
    }

  2- On SUCCESSFUL registration,
    the response body should have `id`, `username` and `password`:
    {
      "id": 1,
      "username": "Captain Marvel",
      "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
    }

  3- On FAILED registration due to `username` or `password` missing from the request body,
    the response body should include a string exactly as follows: "username and password required".

  4- On FAILED registration due to the `username` being taken,
    the response body should include a string exactly as follows: "username taken".
*/

router.post('/register', checkUsername, async (req, res) => {
  try {
    if(!req.body.username || !req.body.password){
      return res.status(401).json('username and password required')
    }
    const hash = bcrypt.hashSync(req.body.password, 8);
    const newUser = await ({ username: req.body.username, password: hash })
    User.add(newUser)
    res.status(201).json(`User successfully created!`)
  } catch (error) {
    res.status(500).json(`Internal server error!`)
  }
});
/*
  IMPLEMENT
  You are welcome to build additional middlewares to help with the endpoint's functionality.

  1- In order to log into an existing account the client must provide `username` and `password`:
    {
      "username": "Captain Marvel",
      "password": "foobar"
    }

  2- On SUCCESSFUL login,
    the response body should have `message` and `token`:
    {
      "message": "welcome, Captain Marvel",
      "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
    }

  3- On FAILED login due to `username` or `password` missing from the request body,
    the response body should include a string exactly as follows: "username and password required".

  4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
    the response body should include a string exactly as follows: "invalid credentials".
*/
function makeToken(user){
  const payload = {
    subject: user.id,
    username: user.username,
  }

  const options = {
    expiresIn: "5000s"
  }
  return jwt.sign(payload, jwtSecret, options)
}

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  User.findBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = makeToken(user)
        res.status(200).json({
          message: `Welcome back ${user.username}!`,
          token
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch();
});

module.exports = router;
