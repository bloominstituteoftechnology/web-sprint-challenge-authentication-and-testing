const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../../config/secret')

const Users = require('../jokes/jokes-model')
const { isValid } = require('../jokes/jokes-service')


router.post('/register', (req, res) => {

  const credentials = req.body;

    if (isValid(credentials)) {
      const rounds = process.env.BYCRYPT_ROUNDS || 8;

      const hash = bcryptjs.hashSync(credentials.password, rounds);

      credentials.password = hash;

      Users.add(credentials)
        .then(user => {
          res.status(201).json({ data: user });
        })
        .catch(error => {
          res.status(500).json({ message: error.message })
        });
    } else {
      res.status(400).json ({ message: 'username and password required' })
    }
});

    router.post('/login', (req, res) => {
      const { username, password } = req.body

      if (isValid(req.body)) {
        Users.findby({ username: username })
          .then(([user]) => {
            if (user && bcryptjs.compareSync(password, user.password)) {
              const token = makeToken(user);
              res.status(200).json({ message: 'Welcome to the Dad Jokes API,' + user.username, token, })
            } else {
              res.status(401).json({ message: 'invalid credentials' });
            }
          })
          .catch(error => {
            res.status(500).json({ message: error.message });
          })
      } else {
        res.status(400).json({ message: 'invalid credentials' })
      }
    });

    function makeToken(user) {
      const payload = {
        subject: user.id,
        username: user.username,
      }
      const options = {
        expiresIn: '900s',
      }
      return jwt.sign(payload, jwtSecret, options)
    }

    module.exports = router;
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

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
