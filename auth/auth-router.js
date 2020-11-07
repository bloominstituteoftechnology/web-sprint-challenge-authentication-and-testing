const router = require('express').Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Users = require("./users-model")

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await Users.findByUsername(username)

    if (user) {
      return res.status(409).json({
        message: `The username "${user.username}" is already taken`
      })
    }

    const newUser = await Users.add({
      username,
      password: await bcrypt.hash(password, 14)
    })

    res.status(201).json(newUser)
  } catch(err) {
    next(err)
  }
})

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await Users.findByUsername(username)

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      })
    }

    const passwordValid = await bcrypt.compare(password, user.password)

    if (!passwordValid) {
      return res.status(401).json({
        message: "Invalid credentials"
      })
    }

    const token = jwt.sign({
      userID: user.id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.json({
      message: `Welcome back, ${user.username}!`
    })
  } catch(err) {
    next(err)
  }
})

module.exports = router