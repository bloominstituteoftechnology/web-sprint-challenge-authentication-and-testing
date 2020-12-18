const User = require('../jokes/jokes-model')

const checkPayload = (req, res, next) => {
    // needs req.body to include username, password
    if (!req.body.username || !req.body.password) {
        res.status(401).json('username and password required');
    } else {
        next();
    }
};

const checkUsernameExists = async (req, res, next) => {
    // username must be in the db already
    // we should also tack the user in db to the req object for convenience
    try {
        const rows = await User.findBy({ username: req.body.username })
        if (rows.length) {
            req.userData = rows[0]
            next();
        } else {
            res.status(401).json('invalid credentials')
        }
    } catch (error) {
        res.status(500).json('something failed tragically')
    }
};

const checkUsernameUnique = async (req, res, next) => {
    // username must not be in the db already
    try {
        const rows = await User.findBy({ username: req.body.username })
        if (!rows.length) {
            next()
        } else {
            res.status(401).json('username taken')
        }
    } catch (error) {
        res.status(500).json('something failed tragically');
    }
};

module.exports = {
    checkPayload,
    checkUsernameExists,
    checkUsernameUnique,

}
