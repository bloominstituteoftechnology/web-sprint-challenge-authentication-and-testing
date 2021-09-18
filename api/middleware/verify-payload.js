module.exports = async (req, res, next) => {
  const {
    username,
    password
  } = req.body
  if (!username
    || !password
    || typeof username
    !== 'string'
    || typeof password
    !== 'string'
    || username
    === ''
    || password
    === '') {
    return next({
      status: 422,
      message: 'username and password required'
    })
  }
  return next()
}
