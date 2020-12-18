const UserAuth = require('../auth/auth-model');

const validateCreds = (req, res, next) => {
  const creds = req.body;
  if(!creds.username || !creds.password) {
    res.status(400).json("username and password required")
  } else {
    next()
  }
}; 

const usernameAvailability = async (req, res, next) => {
  const { username } = req.body;
  const user = await UserAuth.findBy({ username: username });
  if (user) {
    res.status(400).json('username taken');
  } else {
    next();
  }
};

module.exports = {
  validateCreds,
  usernameAvailability
}