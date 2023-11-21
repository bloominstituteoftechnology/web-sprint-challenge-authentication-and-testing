const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const restrict = require('./middleware/restricted.js');

const authRouter = require('./auth/auth-router.js');
const jokesRouter = require('./jokes/jokes-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/jokes', restrict, jokesRouter); // only logged-in users should have access!


server.use('*', (req, res, next) => {
    next({status: 404, message: 'not found'})
})

server.use( (error, req, res, next) => { //eslint-disable-line
    res.status(error.status || 500).json({
        message: error.message || 'error',
        stack: error.stack
    })
})

module.exports = server;