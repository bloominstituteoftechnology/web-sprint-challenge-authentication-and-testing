// do not make changes to this file
const router = require('express').Router();
const jokes = require('./jokes-data');
const { restricted } = require('../auth/auth.middleware')

router.get('/', restricted, (req, res, next) => {
  try {
    res.status(200).json(jokes);
  } catch (err) {
    next(err)
  }
});

module.exports = router;
