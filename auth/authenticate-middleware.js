
const jwt = require("jsonwebtoken")


function auth() {
  return async (req, res, next) => {
    const authError = {err: 'invalid credentials'}

    try{
      const token = req.cookies.token

      if(!token) {return res.status(401).json(authError)}

      jwt.verify(token, 'cake', (err, decoded) => {
        if(err) {return res.status(401).json(authError)}

        next()
      })
      
    }
    catch(err) {next(err)}
  }
}

module.exports = auth
