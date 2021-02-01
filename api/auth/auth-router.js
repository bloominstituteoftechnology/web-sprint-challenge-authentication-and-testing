const router = require('express').Router();
const bcrypt = require('bcryptjs');

const id = 0;

router.post('/register', (req, res) => {
  let user = req.body;
  
  if(user.username === undefined || user.password === undefined){
    res.status(500).send("username and password required")
  }
  const hash = bcrypt.hashSync(user.password, 12);

  user.password = hash;
  
  res.status(200).json({
    ...user,
    id: id + 1
  })
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', (req, res) => {
  let {username, password} = req.body;
  
  if(username === undefined || password === undefined){
    res.status(500).send("username and password required")
  }

  Users.findBy({username: username}).first()
  .then(user => {
    if (user && bcrypt.compareSync(password, user.password)){
      res.status(200).json({message: `welcome ${user.username}`})
    }else {
      res.status(401).json({message: 'Invalid Credentials'})
    }
  })
  .catch(error => {
    res.status(500).json(error);
  })
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
