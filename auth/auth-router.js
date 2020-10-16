const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const Secret = require("./Secret");
const Users = require("../users/users-model");
const { isValid } = require("../users/users-service");

function bodyCheck(req, res, next) {
  const user = req.body;

  if (user.username && user.password) {
    next();
  } else {
    res.status(400).json({ Message: "Please provide a username or password" });
  }
}

router.post("/register", bodyCheck, (req, res) => {
  const user = req.body;

  const hash = bcryptjs.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then((resp) => {
      res.status(201).json({ User: resp });
    })
    .catch((err) => {
      res.status(500).json({ Message: err.message });
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (isValid(req.body)) {
    Users.findBy({ username: username })
      .then(([user]) => {
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = getJwt(user);
          res.status(200).json({ Welcome: username, token: token });
        } else {
          res.status(401).json({ message: "Invalid user" });
        }
      })
      .catch((err) => {
        res.status(500).json({ Message: err.message });
      });
  }
});

function getJwt(user) {
  const payload = {
    username: user.username,
  };
  const secret = Secret.secret;
  const options = {
    expiresIn: "1day",
  };
  return jwt.sign(payload, secret, options);
}

module.exports = router;
