const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model');
const newToken = require('./token-provider');
const { validateUser } = require('./validation');

router.post('/register', (req, res) => {
    let user = req.body

    const validateResult = validateUser(user);
    if (validateResult.isSuccessful === true) {
        const hash = bcrypt.hashSync(user.password);
        user.password = hash;

        Users.add(user)
            .then(saved => {
                const token = newToken(saved);
                res.status(201).json(user);
            })
            .catch(err => {
                res.status(500).json({ message: 'Unable to Complete Request', err })
            })
    } else {
        res.status(400).json({ Message: 'Invalid User Information', errors: validateUser(user) })
    }
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = newToken(user);
                res.status(200).json({ Message: `Welcome ${user.username}`, token, user });
            } else {
                res.status(401).json({ Message: 'Invalid Credentials' });
            }
        })
        .catch(err => {
            res.status(500).json({ Message: 'Unable to Complete Request' })
        })
});

module.exports = router;
