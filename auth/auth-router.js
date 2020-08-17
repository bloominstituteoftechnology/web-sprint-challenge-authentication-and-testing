const router = require('express').Router();
const bcrypt = require('bcryptjs')
const generateToken = require('./generateToken')

const Users = require('../users/usersModel')

router.post('/register', (req, res) => {
  const user = req.body
  const hash = bcrypt.hashSync(user.password, 8)
  user.password = hash

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved)
    })
    .catch(err => {
    res.status(500).json({ message: 'There was an error saving this user to the database', err })
  })
});

router.post('/login', (req, res) => {
  const { username, password } = req.body

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user)

        res.status(200).json({
          message: `Welcome ${user.username}`,
          token
        })
      } else {
        res.status(401).json({ message: 'Invalid Credentials' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'There was an error logging in', err });
    });
});

module.exports = router;