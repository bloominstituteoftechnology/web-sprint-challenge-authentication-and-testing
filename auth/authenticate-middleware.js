/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const bcrypt = require('bcryptjs')
const Users = require('./users-model')

function restrict() {
  return async (req,res,next) => {
    try {

      if(!req.session || !req.user ) {
        return res.status(401).json()
      }

    } catch(err) {
      next(err)
    }
  }
}

module.exports = {
  restrict
}
