const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../../data/dbConfig')
const makeToken = require('../middleware/token')
const isValid = require('../auth/isValid')


router.post('/register', (req, res, next) => {
  const credential = req.body
  
 

  if(isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;
    const hash = bcrypt.hashSync(credential.password, rounds )

    credentials.password = hash

    return db(credentials).insert(credential)
      .then(credential => {
        res.status(201).json({data: user})
      })
      .catch(err => {
        res.status(500).json({message: "username and password required"});
      })
  } else {
    res.status(400).json({message:"username taken" })
  }
  
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
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body
  
  if(isValid(req.body)) {
    await db('users').where( "username", username)
      .then(([user]) => {
        if(user && bcryptjs.compareSync( password, user.password)) {
          const token = makeToken(user)
          res.status(200).json({ message:"Welcome," + user.username, token })
        } else {
          res.status(401).json({ message: 'Invalid Credentials' })
        }
      })
      .catch( err => {
        res.status(500).json({ message: err.message})
      })   
  } else {
    res.status(400).json({
      message: "Username and password required"
    })
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
