const router = require("express").Router();
const {
  checkUsernameExists,
  validateRoleName,
} = require("../middleware/restricted");

const { JWT_SECRET } = require("../secrets");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../users/usersModel");

router.post("/register", validateRoleName, (req, res, next) => {
  const { username, password } = req.body;
  const { role_name } = req;
  const hash = bcrypt.hashSync(password, 8);
  User.add({ username, password: hash, role_name })
    .then((newUser) => {
      res.status(201).json(newUser);
    })
    .catch(next);
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

router.post("/login", checkUsernameExists, (req, res, next) => {
  if (bcrypt.compareSync(req.body.password, req.user.password)) {
    const token = tokenBuilder(req.user);
    res.json({
      message: `welcome ${req.user.username}`,
      token,
    });
  } else {
    next({ status: 401, message: "Invalid Credentials" });
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

function tokenBuilder(user) {
  const payload = {
    subject: user.user_id,
    role_name: user.role_name,
    username: user.username,
  };
  const options = {
    expiresIn: "1d",
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

module.exports = router;
