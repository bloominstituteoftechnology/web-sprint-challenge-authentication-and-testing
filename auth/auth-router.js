const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');

const Users = require('../users/usersModel.js');
const { isValid } = require('../users/usersService.js');
const { jwtSecret } = require('../config/secrets.js');

router.post('/register', (req, res) => {
  // implement registration
  const credentials = req.body;

  if (isValid(credentials)) {
    const rounds =process.env.BCRYPT_ROUNDS || 8;
    const hash = bcrypt.hashSync(credentials.password, rounds);
    credentials.password = hash;
    
    Users.add(credentials)
      .then(user => {
        res.status(201).json({
          data:user
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err.message
        });
      });
  } else {
    res.status(400).json({
      message: 'Please provide credentials'
    });
  }
});

router.post('/login', (req, res) => {
  // implement login
  const {username, password} = req.body;
  
  if (isValid(req.body)) {
    Users.findBy({username })
      .then(([user]) => {
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user);
          res.status(200).json({
              message: `Welcome ${user.username}`,
              token
          });
        } else {
          res.status(401).json({
            message: 'And who are you?'
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          message:err.message
        });
      });
  };
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };
  const options = {
    expiresIn: '2h'
  };
  return jwt.sign(payload, jwtSecret, options);
};

module.exports = router;
