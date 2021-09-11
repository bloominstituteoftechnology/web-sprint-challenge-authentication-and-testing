const User = require('../auth/auth-model');
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../config/secrets");

async function checkUsername(req, res, next) {
    try {
      const rows = await User.findBy({ username: req.body.username })
      if(!rows.length){
        next()
      }else {
        res.status(422).json("Username taken")
      }
    } catch (error) {
      res.status(500).json(`Server error ${error.message}`)
    }
  }

  function checkToken(req, res, next){
    const token = req.headers.authorization

    if(!token){
      res.status(401).json("token please!")
    } else {
      jwt.verify(token, jwtSecret, (err, decoded) => {
        if(err){
          res.status(401).json("token is bad" + err.message)
        } else {
          req.decodedToken = decoded
          next()
        }
      })
    }
  }



  module.exports = {
      checkUsername,
      checkToken
  }