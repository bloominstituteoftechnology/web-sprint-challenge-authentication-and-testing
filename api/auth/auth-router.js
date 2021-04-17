const router = require('express').Router();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const JWT_SECRET = require('../../secrets.js').JWT_SECRET
const users = require('./model.js')

router.post('/register', async (req, res) => {
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
  if (!req.body.username || !req.body.password) {
    res.status(400).json({ message: 'username and password required' })
  } else {
    try {
      let foundUser = await users.findByUsername(req.body.username)
      if (foundUser != null) {
        res.status(400).json({ message: 'username taken' })
      } else {
        let encryptedPassword = bcrypt.hashSync(req.body.password, 8)
        await users.addUser({ username: req.body.username, password: encryptedPassword })
        const createdUser = await users.findByUsername(req.body.username)
        res.status(201).json(createdUser)
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'error registering account' })
    }
  }
});

router.post('/login', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).json({ message: 'username and password required' })
  } else {
    try {
      const foundUser = await users.findByUsername(req.body.username)
      if (foundUser != null) {
        let correctPass = bcrypt.compareSync(req.body.password, foundUser.password) 
        console.log(correctPass)
        if (correctPass) {
          jwt.sign({ username: foundUser.username }, JWT_SECRET, (err, token) => {
            if (err) {
              res.status(500).json({ message: 'error trying to login' })
              console.log(err)
            } else {
              res.status(200).json({ message: `welcome, ${foundUser.username}`, token })
            }
          })
        } else {
          res.status(400).json({ message: 'invalid credentials' })
        }
      } else {
        res.status(400).json({ message: 'invalid credentials' })
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'login error' })
    }
  }
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
});

module.exports = router;
