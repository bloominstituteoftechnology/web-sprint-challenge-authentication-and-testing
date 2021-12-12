const jwt = require("jsonwebtoken")
const secrets = require('../../config/secrets') 

module.exports = async (req, res, next) => {
  const  token = req.headers.authorization
  console.log('token',token )

  if(token){ // Validate token
      jwt.verify(token,secrets.jwtSecret ,(err,decodedToken )=>{
          if(err) {
              next({ status: 401, message:"token invalid"})
          } else {
              req.decodedJwt = decodedToken // return decoded token
              next()
          }
      }) 
  } else {
      res.status(401).json({message: "token required"})
  }


  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};

