const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const {
  restricted,
  checkUsernameExists,
  validateRoleName,
  only,
} = require("./middleware/restricted");

const authRouter = require("./auth/auth-router.js");
const jokesRouter = require("./jokes/jokes-router.js");
const userRouter = require("./users/usersRouter");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use("/api/auth", authRouter);
server.use("/api/jokes", restricted, jokesRouter); // only logged-in users should have access!
server.use(
  "api/users",
  only,
  checkUsernameExists,
  validateRoleName,
  userRouter
);

module.exports = server;
