const db = require('../../data/dbConfig')
const bcrypt = require('bcryptjs')


async function checkUsername (req, res, next) {
    const username = req.body.username
    const exists = await db('users').select('*').where('username', username).first()
    console.log(exists)
    if (exists) {
        next({status: 400, message: 'username taken'})
    }
    else next()
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
    checkUsername, insert, checkUsP
}