const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authenticate = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');

const session = require("express-session");
const server = express();

const sessionConfig = {
    name: "jokersecrets",
    secret: "Secret! Secret! I got a secret!",
    cookie: {
        maxAge: 1000 * 120,
        secure: false,
        httpOnly: true,
    },
    resave: false,
    saveUnintialized: false,
};
server.use(session(sessionConfig));

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, jokesRouter);

module.exports = server;
