const jwt = require('jsonwebtoken');
const secrets = require("../.config/secrets")
const bcrypt = require("bcryptjs");


module.exports = async (user, req, res, next) =>{
    const passwordValid = await bcrypt.compare(req.body.password, user.password)

    if (!passwordValid) {
        return res.status(401).json({
            message: "Invalid Credentials",
        })
    }

    const token = jwt.sign({
        userID: user.id,
    }, secrets.jwtSecret)


    res.cookie("token", token)
    res.cookie("username", user.username)

    return res.json({
        message: `Welcome ${user.username}!`,
        token:token
    })


}