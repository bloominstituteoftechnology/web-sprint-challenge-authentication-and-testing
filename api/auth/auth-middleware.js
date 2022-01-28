const Jokes = require('../jokes/jokes-model')

function checkCredentials (req, res, next) {

    if(!req.body.username || !req.body.password) {
        next({status: 400 , message: "username and password required"})
    } else {
        next()
    }
}

async function checkUsernameExists (req, res, next) {
    try {
      const {username} = req.body
      const [users] = await Jokes.findBy({username})
      if(!users) {
        req.username = users
        next()
      }
      else {
        res.status(401).json({message: 'username taken'})
      }
    }
    catch (err) {
    next(err)
    }
}

module.exports = {
    checkCredentials,
    checkUsernameExists
}