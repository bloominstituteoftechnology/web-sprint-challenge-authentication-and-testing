const router = require('express').Router();

let Users = require('../users/users-model');

let encrypt = require('bcryptjs');
// let jwt = require('jsonwebtoken');
let isValid = require('../utils/validate');
const { createToken } = require('../utils/methods');

router.post('/register', (req, res) => {
  // implement registration
  let creds = req.body;

  if(isValid.isValid  (creds)) {
    let rounds = process.env.BCRYPT_ROUNDS || 8; // defaults to 8 on dev env

    let hash = encrypt.hashSync(creds.password, rounds) //takes pw from body and hashes it 8 times(dev)

    creds.password = hash; // sets original pw from body to newly hashed pw

    Users.create(creds)
    .then(user => {
      res.status(201).json({ data: user })
    })
    .catch(err => {
      res.status(500).json({ error: "Could not create user"})
    })
  } else {
    res.status(400).json({ message: "Provide a username and password" });
  }

});

router.post('/login', (req, res) => {
  // implement login

  let { username, password } = req.body; // extracting from body

  if(isValid.isValid(req.body)) {
    Users.findBy({ username })
    .then(([ user ]) => {
      if(user && encrypt.compareSync(password, user.password)) {
        let token = createToken(user); // creates a token with payload
        res.status(200).json({ token, message: "Login success" })
      } else {
        res.status(401).json({ error: "Either username or password do not match in our records" });
      }
    })
    .catch(err => {
      res.status(500).json("Could not process request")
    })
  } else {
    res.status(400).json({ message: "Please provide a valid username and password"})
  }


});

module.exports = router;
