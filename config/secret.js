require("dotenv").config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET || "Secret is the secret"
}