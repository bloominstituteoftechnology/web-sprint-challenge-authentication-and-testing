// const { jwtSecret } = require('../../config/secrets');
// const jwt = require('jsonwebtoken');
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
        const existingUsername = await Users.findByUsername(req.body.username)
        if (existingUsername) {
            next({status: 400, message: 'username taken'})
        } else {
            next()
        }
    } catch (err) {
        next(err)
    }
}

// On FAILED login due to `username` not existing in the db, or `password` being incorrect,
//       the response body should include a string exactly as follows: "invalid credentials".
const checkLoginPayload = async (req, res, next) => {
    try {
        // const { username, password } = req.body
        const user = await Users.findByUsername(req.body.username)
        // need to decode hash for comparison, 
        // or need to convert inputted password to hash before calling db
        const password = await Users.validatePassword(req.body.password)
        if (!user || !password) {
            next({status: 400, massage: 'invalid credentials'})
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

}
