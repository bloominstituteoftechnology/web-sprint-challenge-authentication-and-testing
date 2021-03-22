const router = require("express").Router();
const db = require("../../data/dbConfig");
const secure = require("bcryptjs");
const jwt = require("jsonwebtoken");

//add new user:
const dbAdd = async (user) => {
  const [id] = await db("users").insert(user);
  return dbFindById(id);
};

//find user from id:
const dbFindById = (id) => {
  return db("users").select("id", "username", "password").where({ id }).first();
};

//find user with filter:
const dbFindByFilter = (filter) => {
  return db("users").select("id", "username", "password").where(filter).first();
};

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(406).json({
        message: "username and password required",
      });
    }
    const user = await dbFindByFilter({ username });
    if (user) {
      return res.status(409).json({
        message: "This user already exists",
      });
    }
    const newUser = await dbAdd({
      username: username,
      password: await secure.hash(password, process.env.HASH_LOOP),
    });
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to register a new account the client must provide `username` and `password`: ✅
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`: ✅
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body, ✅
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken, ✅
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  dbFindByFilter({ username })
    .then((user) => {
      if (user && secure.compareSync(password, user.password)) {
        const token = jwt.sign(
          {
            userID: user.id,
          },
          process.env.JWT_VERIFY
        );
        res.status(200).json({
          message: `Welcome ${user.username}`,
          token: token,
        });
      } else {
        res.status(401).json({
          message: `invalid credentials`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

module.exports = router;
