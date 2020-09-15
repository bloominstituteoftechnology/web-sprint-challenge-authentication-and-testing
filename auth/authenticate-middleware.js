const jwt = require('jsonwebtoken');
// const { jwtSecret } = require('../secrets/authSecret');


function restrict() {
    return async (req, res, next) => {
    const authError = {err: 'invalid credentials'}
    try{
        const token = req.headers.authorization
          if(!token) {return res.status(401).json(authError)}
         jwt.verify(token, 'safe', (err, decoded) => {
           if(err) {return res.status(401).json(authError)}
           next()
         })
      }
       catch(err) {next(err)}
     }
   }


module.exports = restrict 

    // = req.headers;
    // if (authorization) {
    //     jwt.verify(authorization, jwtSecret, (err, decodedToken) => {
    //         if (err) {
    //             res.status(401).json({ message: "Invalid credentials" });
    //         } else {
    //             req.decodedToken = decodedToken;
    //             next();
    //         }
    //     });
    // } else {
    //     res.status(400).json({ message: "Please enter credentials" });
