const Users = require('../users/user-model')

const checkPayload = (req, res, next) => {
try {
  const { username, password } = req.body
    if (!username || !password) {
        res.status(404).json({message: 'A username and password is required'})
} else {
    req.username = username
    req.password = password
    next()
}
} catch (err) {
     next(err)
}}


const isUsernameUnique = async (req, res, next) => {
  try {
    const existingUsername = await Users.findByUsername(req.body.username)
    if (!existingUsername.length) {
     next()
} else {
     next({ status: 401, message: 'this username is already taken' })
}
} catch (err) {
     next(err)
}}


const validateLogin = async (req, res, next) => {
try {
const user = await Users.findByUsername(req.body.username)
    const password = await Users.validatePassword(req.body.password)
    if (!user || !password) {
    next({ status: 400, message: 'invalid credentials' })
} else {
    next()
}
} catch (err) {
     next(err)
}}

module.exports = { checkPayload,
    isUsernameUnique,
    validateLogin,
};