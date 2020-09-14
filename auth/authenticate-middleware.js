const jwt = require("jsonwebtoken")
const secrets = require("../.config/secrets")

module.exports = (req, res, next) => {
  const authError = { you: 'shall not pass!' }
  try {
    // token is coming from the client's cookie jar, in the "Cookie" header
    const token = req.cookies.token
    console.log(` token is ${token}`)
    if (!token) {
      console.log("!token")
      return res.status(401).json(authError)
    }

    // decode the token, re-sign the payload, and check if signature is valid
    jwt.verify(token, secrets.jwtSecret, (err, decoded) => {
      console.log(`inside verify secret is ${secrets}`)
      if (err) {
        return res.status(401).json(authError)
      }

      // we know the user is authorized at this point,
      // make the token's payload available to other middleware functions
      req.token = decoded
      next()
    })
  } catch(err) {

    next(err)

  }
};
