const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../secrets/authSecret');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (authorization) {
        jwt.verify(authorization, jwtSecret, (err, decodedToken) => {
            if (err) {
                res.status(401).json({ message: "Your credentials are wrong" });
            } else {
                req.decodedToken = decodedToken;
                next();
            }
        });
    } else {
        res.status(400).json({ message: "No credentials provided" });
    }

};