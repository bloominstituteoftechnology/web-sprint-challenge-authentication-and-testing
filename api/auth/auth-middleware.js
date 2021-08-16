const { findBy } = require('./auth-model');

const checkUsernameDoesNotExists = async (req, res, next) => {
  try {
    const [user] = await findBy({ username: req.body.username });
    if (user) {
      next({
        status: 401,
        message: "username taken",
      });
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    next(err);
  }
};


module.exports = {
  checkUsernameDoesNotExists
};
