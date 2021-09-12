const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const restrict = require('./middleware/restricted.js');

const authRouter = require('./auth/auth-router.js');
const jokesRouter = require('./jokes/jokes-router.js');
const usersRouter = require('./users/users-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter)
server.use('/api/jokes', restrict, jokesRouter); // only logged-in users should have access!

  server.use((err, req, res, next) => { // eslint-disable-line
    console.log(err)
    res.status(err.status).json({
      message: err.message,
      stack: err.stack,
    });
  });

module.exports = server;