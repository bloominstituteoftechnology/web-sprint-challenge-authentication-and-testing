const router = require('express').Router();
const jwt = require("jsonwebtoken") // creates token
const secrets = require('../../config/secrets')
const User = require('./auth-model.js')

const bcrypt = require('bcryptjs') // creates hash 
const { BCRYPT_ROUNDS } = require('../../config')

const { checkUserExists, validateBody } = require('./auth-middleware')



router.post('/register',checkUserExists,validateBody,  async (req, res, next) => {

  try {
    const { username , password} = req.body

    // bcrypting the password before saving
    const hash = bcrypt.hashSync(password, BCRYPT_ROUNDS)
    // never save the plain text password in the db
    const user = { 'username': username , 'password':hash} 

    const NewUser = await User.add(user)
    res.status(201).json({'id': NewUser.id,
                        'username': NewUser.username,
                        'password': NewUser.password,
                      })
  } catch(err) {
    next(err)
  }
});
  //res.end('implement register, please!');
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


router.post('/login', validateBody,async (req, res, next) => {  
        const { username , password } = req.body 
        const newUser = await User.findBy({username})
        const user = newUser[0]
        if(user && bcrypt.compareSync(password, user.password) ){
        // generate a token and include it in the response
        const token = generateToken(user)
          res.status(200).json({
            message :`welcome, ${user.username}`,
            token: token
          })
        } else {
          next({ status: 401, message: 'invalid credentials' })
        }

});



  //res.end('implement login, please!');
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


function generateToken (user) {
  const payload = {
    subject: user.id,
    username: user.username
  }

  const options = {
    expiresIn: '1d',
  }
  const secret = secrets.jwtSecret

  return jwt.sign(payload,secret,options)

}


module.exports = router;
