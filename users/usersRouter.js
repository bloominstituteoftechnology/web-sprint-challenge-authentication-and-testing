const router = require('express').Router()

const Users = require('./usersModel')

router.get('/', (req, res) => {
   Users.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => res.json(err.message))
})

module.exports = router;