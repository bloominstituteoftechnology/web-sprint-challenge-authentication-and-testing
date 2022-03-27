const User = require('../user/user-model');

module.exports = async function(req, res, next) {
    const { username } = req.body;
    const user = await User.findByUsername(username);
    if (!user) {
        res.status(400).json({ message: 'invalid credentials' })
    } else {
        req.user = user
        next()
    }
}