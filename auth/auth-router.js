const bcryptjs = require('bcryptjs');
const router = require('express').Router();
const jwt = require('jsonwebtoken');

const Users = require('../users/users-model');
const { isValid } = require('../users/users-service');

router.post('/register', (req, res) => {
  const credentials = req.body;

  try {
    if (isValid(credentials)) {
      const rounds = process.env.BCRYPT_ROUNDS ?
        parseInt(process.env.BCRYPT_ROUNDS) : 8;

      const hash = bcryptjs.hashSync(credentials.password, rounds);
      credentials.password = hash;

      const user = Users.add(credentials);
      const token = generateToken(user);
      res.status(201).json({ data: user, token });
    } else {
      res.status(400).json({message: 'username or password missing' });
    }
  } catch (err) {
    res.status(500).json({message: 'error saving new user', ...err });
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  try {

    if (!isValid(req.body)) {
      res.status(400).json({message: 'username or password missing' });
    } else {
      const [user] = Users.findBy({ username: username });
      if (user && bcryptjs.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: 'welcome to the api', token: token });
      } else {
        res.status(401).json({message: 'invalid credentials' });
      }
    }
  } catch (err) {
    console.log("error", ...err)
    res.status(500).json({message: 'db error logging in', ...err });
  }
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    role: user.role
  };
  const options = {
    expiresIn: "1d"
  };
  
  const secret = process.env.JWT_SECTRET || "tra-la-la";

  const token = jwt.sign(payload, secret, options);
  return token;
}

module.exports = router;
