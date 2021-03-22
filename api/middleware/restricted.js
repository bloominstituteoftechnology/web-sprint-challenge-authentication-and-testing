const jwt = require("jsonwebtoken");

function restrict() {
  return async (req, res, next) => {
    const authError = {
      message: "invalid credentials",
    };
    try {
      const token = req.header.authorization;
      if (!token) {
        return res.status(401).json(authError);
      }
      jwt.verify(token, process.env.JWT_VERIFY, (err, decode) => {
        if (err) {
          return res.status(401).json(authError);
        }
        req.token = decode;
        next();
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { restrict };
/*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
