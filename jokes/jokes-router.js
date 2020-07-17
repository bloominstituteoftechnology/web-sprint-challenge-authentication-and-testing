const axios = require('axios');
const Users = require('../users/model')
const restricted = require('../auth/authenticate-middleware')

const router = require('express').Router();

router.get('/', restricted, (req, res) => {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
});

router.get('/user', restricted, (req, res) => {
  Users.find()
      .then(param => {
          res.status(200).json(param)
      })
      .catch(err => {
          res.status(500).json(err)
      })
})

module.exports = router;
