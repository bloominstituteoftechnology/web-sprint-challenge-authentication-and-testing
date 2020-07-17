const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/model');
const newToken = require('./giveToken');
const { validateUser } = require('../users/validation');

router.post('/register', (req, res) => {
    let user = req.body

    const validateResult = validateUser(user);
    if (validateResult.isSuccessful === true) {
        const hash = bcrypt.hashSync(user.password, 8);
        user.password = hash;

        Users.add(user)
            .then(saved => {
                const token = newToken(saved);
                res.status(201).json(token);
            })
            .catch(err => {
                res.status(500).json({ message: 'I need this break', err })
            })
    } else {
        res.status(400).json({ Message: 'not valid', errors: validateUser(user) })
    }
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = newToken(user);
                res.status(200).json({ Message: `Welcome ${user.username}`, token });
            } else {
                res.status(401).json({ Message: 'Credentials not valid' });
            }
        })
        .catch(err => {
            res.status(500).json({ Message: 'Danger Will Robinson! Danger!' })
        })
});

module.exports = router;
