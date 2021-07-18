const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const {jwtSecret} = require("../../config/secrets.js")
const Users = require('../users-model.js');
const {
  checkForDuplicates,
  checkPayload,
  checkUsernameExists,
} = require('../middleware/validate-user.js');

/*
module.exports = {
    add,
    findUsers,
    findByUserName,
    findByUserId,
}
*/

router.post('/register', checkPayload, checkForDuplicates, (req, res) => {

  // MY CODE STARTS HERE

  let user = req.body;

  // bcrypting the password before saving
  const rounds = process.env.BCRYPT_ROUNDS || 8; // 2 ^ 8
  const hash = bcrypt.hashSync(user.password, rounds);

  // never save the plain text password in the db
  user.password = hash

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(err => {
      res.status(500).json({
        message: `Error: ${err}`
      })
    }); 
  // MY CODE ENDS HERE


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

router.post('/login', checkPayload, (req, res) => {
//   res.end('implement login, please!');
console.log("starting /login");
let { username, password } = req.body;
console.log("username: ", username)
console.log("password ", password)
Users.findByUserName(username) 
  .then((user) => {
    console.log("user.username", user.username);
    console.log("user.password", user.password);
    if (user && bcrypt.compareSync(password, user.password)) {
      console.log("credentials are correct")
      const token = makeToken(user)
      res.status(200).json({
          message: "welcome, Captain Marvel",
          token: token
      });
    } else {
      res.status(401).json({ message: 'Invalid Credentials' });
    }
  })
  .catch((err) => {
    res.status(500).json(err)
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
});

function makeToken(user){
  const payload = {
    subject:user.id,
    username:user.username
  }
  const options = {
    expiresIn: "500s"
  }
  return jwt.sign(payload,jwtSecret,options)
}

module.exports = router;
