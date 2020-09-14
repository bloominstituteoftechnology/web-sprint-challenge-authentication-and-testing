/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.token || req.body.token;
    if (!token) {
      return res.status(401).json({
        message: 'missing required token',
      });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: 'invalid token',
        });
      }
      if (decoded.userID !== req.userID) {
        return res.status(403).json({
          message: 'unauthorized user',
        });
      }
      req.token = decoded;
      next();
    });
  } catch (err) {
    next(err);
  }
};
