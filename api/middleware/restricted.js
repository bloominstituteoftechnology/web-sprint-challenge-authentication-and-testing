  
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../auth/secrets');

module.exports = (req, res, next) => {
 
   const token = req.headers.authorization;
  if(token){
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if(err){
        next({status:401, message:'token invalid'})
      }//end of if
      else{
        next();
      }//end of else
    })
  }//end of if
  else{
    next({ status: 401, message: 'token required' })
  }//end of else
  
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
