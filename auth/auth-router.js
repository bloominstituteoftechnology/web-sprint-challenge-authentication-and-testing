const router = require("express").Router();

const bcryptjs = require("bcryptjs");

const db = require("./auth-model");

router.post("/register", (req, res) => {
  let user = req.body;

  const hash = bcryptjs.hashSync(user.password, 12);

  user.password = hash;

  db.add(user)
    .then((saved) => {
      res.status(201).json(saved);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  db.findBy({ username })
    .then((user) => {
      console.log(user);
      if (user && bcryptjs.compareSync(password, user.password)) {
        req.session.user = user;
        req.session.loggedIn = true;
        res.status(200).json({ message: `Welcome ${user.username}` });
      } else {
        res.status(401).json({ message: "invalid credentials" });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

module.exports = router;
