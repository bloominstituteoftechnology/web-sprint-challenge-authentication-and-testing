const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

module.exports = (req, res, next) => {

  try{
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';

    if(token){
      jwt.verify(token, secret, (err, decodedToken)=>{
        if(err){
          res.status(401).json({you: "shall not pass!"});
        }else {
          req.decodedToken = decodedToken;
          next();
        }
      });
    }else {
      res.status(401).json({you: 'shall not pass!'});
    }
  } catch(err) {
    res.status(500).json({message: 'error validating credentials', ...err});
  }
 
};
