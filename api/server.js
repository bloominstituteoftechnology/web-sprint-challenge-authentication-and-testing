const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex");
const database_access = require("../data/dbConfig");
const environment = require("dotenv/config");
const restrict = require("./middleware/restricted.js");

const authRouter = require("./auth/auth-router.js");
const jokesRouter = require("./jokes/jokes-router.js");
const Knex = require("knex");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.JWT_VERIFY || "shhh",
    store: new KnexSessionStore({
      knex: database_access,
      createtable: true,
    }),
  })
);
server.use("/api/auth", authRouter);
server.use("/api/jokes", restrict.restrict(), jokesRouter); // only logged-in users should have access!

module.exports = server;
