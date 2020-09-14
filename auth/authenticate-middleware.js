/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require("jsonwebtoken")

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