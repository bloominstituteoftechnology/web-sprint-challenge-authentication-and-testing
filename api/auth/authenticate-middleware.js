const jwt = require('jsonwebtoken');

function restrict(){
  return async (req, res, next) => {
    try{
      const token = req.cookies.token;

      if(!token){
        return res.status(401).json({
          message: "You shall not pass"
        })
      }

      jwt.verify(token, process.env.TOKEN, (err, decoded) => {
        if(err){
          return res.status(401).json({
            message: "You shall not pass"
          })
        }

        req.token = decoded;

        next()
      })
    } catch(error){
      console.log(error);
    }
  };
  
}

module.exports = {
  restrict
}