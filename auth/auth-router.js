const router = require('express').Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const config = require('../api/config');
const Users = require('../users/user-model');
const {isValid} = require('../users/user-service');

router.post('/register', (req, res) => {
  // implement registration
  const credentials = req.body;

  if(isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;

    const hash = bcryptjs.hashSync(credentials.password, rounds);

    credentials.password = hash;

    Users.add(credentials)
      .then(user => {
        res.status(201).json({data:user})
      })
      .catch(err => {
        res.status(500).json({message:error.message})
      })
  } else {
    res.status(400).json({
      message: "please provide username and password and the password shoud be alphanumeric",
    });
  }
});

router.post('/login', (req, res) => {
  // implement login
  const { username, password } = req.body;
    
  if (isValid(req.body)) {
    Users.getBy({ username })
      .then((user) => {
        if (user && bcryptjs.compareSync(password, user.password)) {
            const token = getJwt(user);
            res.status(200).json({ message: "Welcome to our API", token });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
    } else {
      res.status(400).json({
        message: "please provide username and password and the password shoud be alphanumeric",
      });
    }
});

function getJwt(user) {
  const payload = {
      username: user.username,
  };

  const jwtOptions = {
      expiresIn: "8h",
  };

  return jwt.sign(payload, config.jwtSecret, jwtOptions);
}

module.exports = router;
