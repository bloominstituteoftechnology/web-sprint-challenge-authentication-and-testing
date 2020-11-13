const {jwtSecret} = require('./secret') 
const {jwt} = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if(!token){
    res.status(401).json({ you: 'token needed!' })
    return
  }
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      console.log('decoded error -->', err)
      res.status(401).json({ message: 'bad token'});
      return;
    }

    console.log('decoded token -->', decoded);
    req.decodedJwt = decoded;
    next();
  })

};
