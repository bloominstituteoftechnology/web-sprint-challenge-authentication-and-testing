const Users = require('../users/users-model');

// On FAILED registration or login due to `username` or `password` missing from the request body,
//       the response body should include a string exactly as follows: "username and password required".
const checkPayload = (req, res, next) => {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            res.status(404).json({message: 'username and password required'})
        } else {
            req.username = username
            req.password = password
            next()
        }
    } catch (err) {
        next(err)
    }
}

// On FAILED registration due to the `username` being taken,
//       the response body should include a string exactly as follows: "username taken".
const uniqueUsername = async (req, res, next) => {
    try {
        const existingUsername = await Users.findByUsername({ username: req.body.username })
        if (!existingUsername.length) {
            next()
        } else {
            next({ status: 401, message: 'username taken' })
        }
    } catch (err) {
        next(err)
    }
}

// On FAILED login due to `username` not existing in the db, or `password` being incorrect,
//       the response body should include a string exactly as follows: "invalid credentials".
const checkLoginPayload = async (req, res, next) => {
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
    }
}

module.exports = {
    checkPayload,
    uniqueUsername,
    checkLoginPayload,
};
