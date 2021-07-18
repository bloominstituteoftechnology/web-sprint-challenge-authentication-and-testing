const Users = require("../users-model.js")
const bcrypt = require("bcryptjs")

// Checks to see if the username is already in the DB
const checkForDuplicates = async (req, res, next) => {
    try {
        const username = req.body.username;
        const user = await Users.findByUserName(username).first()
        if (user) {
            return res.status(400).json({
                message: "Username is already taken. Please use another username.",
            })
        } else {
            next()
        }

    } catch (err) {
        next(err)
    }
}


// Checks if the body has a username and password 
const checkPayload = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(400).json(
            "username and password required"
        )
    } else {
        next()
    }
}


// Checks if the user exists in the DB
const checkUsernameExists = async (req, res, next) => {
    try {
        const username = req.body.username;
        const user = await Users.findByUserName(username).first()

        if (!user) {
            return res.status(401).json({
                message: "invalid credentials",
            })
        }

        const passwordValid = await bcrypt.compare(req.body.password, user.password)

        if (!passwordValid) {
            return res.status(401).json({
                message: "invalid credentials",
            })
        }

        req.user = user
        next()

    } catch (err) {
        next(err)
    }
}

module.exports = {
    checkForDuplicates,
    checkPayload,
    checkUsernameExists,
}