const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const usersRouter = require('./auth/auth-router')

const server = express()
const port = process.env.PORT || 3300

server.use(helmet())
server.use(cors())
server.use(express.json())
server.use(cookieParser())
// server.use(session({
// 	resave: false, // avoid recreating sessions that have not changed
// 	saveUninitialized: false, // comply with GDPR laws for setting cookies automatically
// 	secret: "keep it secret, keep it safe", // cryptographically sign the cookie
// }))

server.use(usersRouter)
server.use((err, req, res, next) => {
  console.log(err)

  res.status(500).json({
    message: 'Something went wrong',
  })
})

server.listen(port, () => {
  console.log(`Running at http://localhost:${port}`)
})
