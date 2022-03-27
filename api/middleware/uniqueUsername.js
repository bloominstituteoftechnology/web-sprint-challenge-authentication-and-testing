const User = require('../../user/user-model');

async function uniqueUsername(req, res, next) {
    const { username } = req.body;
    const user = await User.findByUsername(username);
    if (user) {
        res.status(400).json({ message: 'username taken'})
    } else {
        next()
    }
}

module.exports = {
 uniqueUsername
}