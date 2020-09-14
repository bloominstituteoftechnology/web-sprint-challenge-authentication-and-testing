const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const logger = require('morgan');
const cors = require('cors');
const authenticate = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(logger('dev'));
server.use(cookieParser());
server.use(express.json());
server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, jokesRouter);

module.exports = server;
