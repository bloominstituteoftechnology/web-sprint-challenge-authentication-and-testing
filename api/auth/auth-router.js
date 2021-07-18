const router = require('express').Router();
const { JWT_SECRET } = require("../secrets/index.js"); // importing the secret we made with jsonwebtoken library
const bcrypt = require('bcryptjs'); //for hashing 
const jwt = require('jsonwebtoken');
//const { default: jwtDecode } = require("jwt-decode"); //find where I'm creating this?
const { checkForDuplicates,
  checkPayload,
  checkUsernameExists, } = require('../middleware/middleware.js'); //importing our middleware restricted

const users = require("./auth-model.js"); //Importing our users data from our model folder, where it's importing it from our dbconfig
/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
router.post('/register', checkPayload, checkForDuplicates, (req, res) => {
  let user = req.body;

  // bcrypting the password before saving
  const rounds = process.env.BCRYPT_ROUNDS || 8; // 2 ^ 8
  const hash = bcrypt.hashSync(user.password, rounds);

  // never save the plain text password in the db
  user.password = hash

  users.add(user)
    .then(saved => {
      console.log("saved: ", saved)
      res.status(201).json(saved);
    })
    .catch(err => {
      res.status(500).json({
        message: `Error: ${err}`
      })
    }); 
});

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

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  router.post('/login', checkPayload, checkUsernameExists, (req, res) => {
    
        //console.log("starting /login");
    let { username, password } = req.body;
        //console.log("username: ", username)
        //console.log("password ", password)
    users.findByUserName(username) 
      .then((user) => {
          // console.log("user.username", user.username);
          // console.log("user.password", user.password);
        if (user && bcrypt.compareSync(password, user.password)) {
          console.log("credentials are correct")
          const token = makeToken(user) //see below for the makeToken function we create
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
/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
//MAKE TOKEN FUNCTION FOR THE POST REQUEST
      function makeToken(user){
        const payload = {
          subject:user.id,
          username:user.username
        }
        const options = {
          expiresIn: "500s"
        }
        return jwt.sign(payload, JWT_SECRET, options)
      }
      
     

module.exports = router;
