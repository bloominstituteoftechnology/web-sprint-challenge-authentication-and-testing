const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Jokes = require("../jokes/jokes-model");
const { BCRYPT_ROUNDS } = require("../secrets/index");
const {
  checkCredentials, 
  checkUsernameExists
} = require('../auth/auth-middleware')
const makeToken = require("./auth-token-builder");


router.post("/register",checkCredentials, checkUsernameExists , async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const hash = bcrypt.hashSync(password, BCRYPT_ROUNDS);
    const newUser = { username, password: hash };
    const addedUser = await Jokes.add(newUser);
    res.status(200).json({ message: `Welcome, ${addedUser.username}` });
  } catch (err) {
    next(err);
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

router.post("/login",checkCredentials, (req, res, next) => {
  let { username, password } = req.body;
  Jokes.findBy({ username })
  .then(([user]) => {
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = makeToken(user);
      res.status(200).json({ message: `${user.username} is back!`, token });
    } else {
      next({ status: 401, message: "invalid credentials" });
    }
  })
  .catch(next);
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
