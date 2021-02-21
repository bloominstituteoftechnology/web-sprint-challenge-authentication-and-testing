const router = require('express').Router();
const Users = require('./auth-model.js')
const bcryptjs = require("bcryptjs")
const jwt = require('jsonwebtoken')
const secrets = require('../../config/secrets.js')


function checkBody(req,res,next) {
  const user = req.body;
  if(!user || !user.username || !user.password) {
    res.status(401).json({message:  "username and password requried for login"})
  } else {
    req.user = user;
    next();
  }
};

function createToken(username){
  const payload = {
    username,
  };
  const options = {
    expiresIn: "1h"
  };
  return jwt.sign(payload,secrets.jwtSecret,options)

};
//middleware

router.post('/register', checkBody, async (req, res) => {
let {username, password} = req.user;

const hash = bcryptjs.hashSync(password, 10);

  try {
    const registered = await Users.createUser({ username, password: hash });
    res.status(201).send(registered);
  } catch (err) {
    res.status(500).json({message: "Another user already has this name, please try another one"})
  }
});
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


router.post('/login', checkBody, async (req, res) => {
  let {username, password} = req.user;

  try {
    const savedUser = await Users.findByUsername(username);
    if(savedUser) {
      if(bcryptjs.compareSync(password, savedUser.password)) {
        const token = createToken(savedUser.username);
        res.status(200).json({message: `welcome ${savedUser.username}`, token})
      } else {
        res.status(403).json({message: "invalid login credentials"})
      }
      } else{
        res.status(403).json({message: "invalid login credentials"})
      }
      } catch (err){
        res.status(500).json({message: "error"})
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


module.exports = router;
