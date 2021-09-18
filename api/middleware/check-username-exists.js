const User = require('../auth/auth-model')

module.exports = (req, res, next) => {
  const {username} = req.body

  User.getBy({username})
    .then(found => {
      if (found[0]) {
        if (req.url === '/register') return next({
          status: 409,
          message: 'username taken'
        })
        if (req.url === '/login') {
          req.user = found[0]
          return next()
        }
      }
      if (!found[0] && req.url === '/register') return next()
      if (!found[0] && req.url === '/login') return next({
        status: 404,
        message: 'invalid credentials'
      })
    })
    .catch(next)
}
