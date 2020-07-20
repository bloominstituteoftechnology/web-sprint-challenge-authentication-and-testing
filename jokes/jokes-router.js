const axios = require('axios')
// const Users = require('../auth/users-model')
const router = require('express').Router()
const restrict = require('../auth/authenticate-middleware')

router.get('/', restrict(), async (req, res, next) => {
  const requestOptions = {
    headers: { accept: 'application/json' },
  }

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results)
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err })
    })
})
// router.get('/users', restrict(), async (req, res, next) => {
//   try {
//     res.json(await Users.find())
//   } catch (err) {
//     next(err)
//   }
// })

module.exports = router
