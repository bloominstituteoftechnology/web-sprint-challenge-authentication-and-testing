const jwt = require("jsonwebtoken")
const secrets = require('../../config/secrets.js')


module.exports = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1] ?? req.headers?.authorization;

  if(!token) {
    res.status(403).json({message: "token required"});
  } else {
    jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
      if(err) {
        res.status(403).json({message: "token not valid"});
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    });
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
