const router = require('express').Router();
const bcrypt = require('bcryptjs');
const tokenBuilder = require('./token-builder');
const Users = require('../users/users-model');
const {
  checkPayload,
  uniqueUsername,
  checkLoginPayload,
} = require('../middleware/auth-middleware');



router.post('/register', checkPayload, uniqueUsername, (req, res, next) => {
  const { username, password } = req.body
  
  const hash = bcrypt.hashSync(password, 8);

  Users.add({ username, password: hash })
      .then(newUser => {
        res.status(200).json(newUser)
      })
      .catch(next)
});

router.post('/login', checkPayload, checkLoginPayload, (req, res, next) => {
  const { username, password } = req.body
  
  Users.findByUsername(username)
  .then(([user]) => {
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = tokenBuilder(user)
    res.status(200).json({
      message: `welcome, ${username}`,
      token
    })
    } else {
      next({ status:401, message: 'invalid credentials' })
    }
  })
  .catch(next)
});

module.exports = router;
