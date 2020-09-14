const router = require('express').Router();
const bcrypt = require("bcryptjs");
const Users = require('./users-model');
const jwt = require('jsonwebtoken');
const secrets = require("../.config/secrets")

const user_valid = require('./user_validation')


router.post('/register', async (req, res, next) => {
  // implement registration
    try {
        const { username, password } = req.body
        const user = await Users.findBy({ username }).first()

        if (user) {
            return res.status(409).json({
                message: "Username is already taken",
            })
        }
        console.log(username)
        if(username === "" || !username){
            return res.status(409).json({message:"Please enter a username"})
        }

        if(password === "" || !password){
            return res.status(409).json({message:"Please enter a password"})
        }

        const newUser = await Users.add({
            username,
            // hash the password with a time complexity of 14
            password: await bcrypt.hash(password, 14),
        })

        await res.status(201).json({
            'username': username , 'password': newUser.password})
    } catch(err) {
        next(err)
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await Users.findByUsername({ username }).first()

        if (!user) {
            return res.status(401).json({
                message: "Invalid Credentials",
            })
        }

        await user_valid(user,req, res,)


    } catch(err) {
        next(err)
    }
})

module.exports = router;