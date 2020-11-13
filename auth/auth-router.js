const router = require('express').Router()
const bcrypt = require('bcryptjs')
const Users = require("../users/user-model.js")
const jwt = require("jsonwebtoken")
const { jwtSecret } = require("../database/secret")




//get users
router.get('/users', async (req, res) => {
  const getUsers = await users.get()
  res.status(200).json(users)
})



router.post('/register', async (req, res) => {
  if (!req.body.password || !req.body.username) {
    res.status(400).json({ message: 'error' })
  } else {
    const username = req.body.username;
    const duplicateUser = await users.getBy({ username })

    if (duplicateUser.length > 0) {
      res.status(400).json({ message: 'username exists' })
    } else {
      let user = req.body;
      const hash = bcrypt.hashSync(user.password, 10)

      user.password = hash
      try {
        await users.create(user)
        res.status(201).json({ message: 'User has been created!' })
      } catch (err) {
        console.log(err)
        res.status(500).json(err)
      }
    }
  }
})




router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await users.getBy({ username })

    if (user.length === 0) {
      return res.status(401).json({
        message: 'Invalid',
      })
    }
    const passwordValid = bcrypt.compareSync(password, user[0].password)

    if (!passwordValid) {
      return res.status(401).json({
        message: 'Password not valid',
      })
    }
    const token = jwt.sign(
      {
        userID: user.id,
      },
      process.env.JWT_SECRET
    )

    res.cookie('token', token)
    res.json({
      token,
      message: `Howdy ${user[0].username}`,
    })
  } catch (err) {
    next(err)
  }
})




module.exports = router
