const router = require('express').Router();
const dbConfig = require('../../data/dbConfig');
//imports
const authModel = require('../../model/authModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const secrets = require('../../config/secrets');

router.post('/register', async (req, res) => {
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
  try{
    const newUser = await (req.body);
    const hash = bcrypt.hashSync(newUser.password, 12)
    
    newUser.Password = hash
    await authModel.insert(newUser)
    .then(resolve=>{
        res.json({message: 'Welcome User',
            newUser: newUser});
    })
    .catch(err=>{
        res.status(500).json({message: `Could not register, user already exists.`})
    })
}

catch (err){
    
    res.status(400).json({
        message: `Could not register new user.`,
        err: err
    });
}

});

router.post('/login', async (req, res, next )=>{
    
  const { username, password } = req.body;
  let user = await authModel.getBy(username)
  
  .then(resolved=>{
    if(user.length !== 0 && bcrypt.compareSync(password, user[0].password)){
      req.session.user = user;
      req.session.token = generateToken(user);

      res.status(200).json(req.session)
    }else{
        res.status(401).json({message: `You are not authorized.`})
    }
  })
  .catch(err=>{
    res.status(401).json({message: `You are not authorized.`})
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

    //GET - Logs user out
    router.get('/logout', async (req, res)=>{

      req.session.destroy(err=>{
          if(err){
              res.status(200).json({err: err})
          }else{
              res.status(200).json({message: `Session destroyed, user has been logged out.`})
          }
      })
  })
      

//Token Generator
function generateToken(user) {
  const payload = {
    subject: user.id, // sub in payload is what the token is about
    username: user.username,
    department: user.department
    // ...otherData
  };

  const options = {
    expiresIn: '1d', // show other available options in the library's documentation
  };

  // extract the secret away so it can be required and used where needed
  return jwt.sign(payload, secrets.jwtSecret, options); // this method is synchronous
}
// router.post('/login', async (req, res, next)=>{
  
//    const {username, password} = req.body;

//    res.status(200).send(req.body);

// })


module.exports = router;
