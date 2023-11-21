const db = require('../../data/dbConfig')
const bcrypt = require('bcryptjs')


async function checkUsername (req, res, next) {
    const username = req.body.username
    const exists = await db('users').select('*').where('username', username).first()
    if (exists) {
        next({status: 400, message: 'username taken'})
    }
    else next()
}

async function checkLogin (req, res, next) {
    try {
        const user = await db('users').select('*').where('username', req.body.username).first()
        if (user) {
            req.user = user
            next()
        }
        else {
            next({status: 401, message: 'invalid credentials'})
        }
    }
    catch (error) {
        next(error)
    }
}

async function checkUsP (req, res, next) {
    const {username, password} = req.body

    if (!username || !password) {
        next({status: 402, message: 'username and password required'})
    }
    else next()
}

async function insert (req, res, next) {
    try {
        let {username, password} = req.body
        password = await bcrypt.hashSync(password, 8)
    
        await db('users').insert({username, password})

        const user = await db('users').select('*').where('username', username).first()
        res.status(201).json(user)
    }
    catch (error) {
        next(error)
    }
}

module.exports = {
    checkUsername, insert, checkUsP, checkLogin
}