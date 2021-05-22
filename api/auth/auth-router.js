const router = require('express').Router();
const Users = require('./auth-model');
const bcrypt = require("bcryptjs");
const buildToken = require('./token-builder');

router.post('/register', (req, res, next) => {

  let user = req.body
  if(!user.username || !user.password)
  {
    res.status(400).json({
      message:"username and password required"
    })
  }
  else
  {
    const hash = bcrypt.hashSync(user.password, 2);
    user.password = hash;
    Users.add(user)
    .then(user =>{
      res.status(201).json(user)
    })
    .catch(next);
  }
});

router.post('/login', (req, res, next) => {
  const {username, password} = req.body
  Users.findBy({username})
  .then(user =>{
      if(user && bcrypt.compareSync(password, user.password))
      {
        const token = buildToken(user)
        // console.log(`user.username ${user.username}`)
        res.status(200).json({
          message:`welcome, ${user.username}`,
          token
        })
      }
      else
      {
        console.log("inside else")
        res.status(401).json({
          message:'invalid credentials'
        })
      }
  
  })
});

module.exports = router;
