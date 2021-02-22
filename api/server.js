const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('morgan');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);


const restrict = require('./middleware/restricted.js');

const authRouter = require('./auth/auth-router.js');
const jokesRouter = require('./jokes/jokes-router.js');

const server = express();

//session config
const sessionConfig = {
    name:'a-session',
    secret: 'keep it secret keep it safe',
    cookie:{
        maxAge: 60 * 60 * 1000,
        secure: false ,//true in production
        httpOnly: true
    },
    resave: true,
    saveUninitialized: true,
    store: new KnexSessionStore({
        knex: require('../data/dbConfig'),
        table: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 60 * 60 * 1000
    })
}

server.use(session(sessionConfig));
server.use(helmet(), logger('short'));
server.use(cors());
server.use(express.json());


server.use('/api/auth', authRouter);
server.use('/api/jokes', restrict(), jokesRouter); // only logged-in users should have access!

module.exports = server;
