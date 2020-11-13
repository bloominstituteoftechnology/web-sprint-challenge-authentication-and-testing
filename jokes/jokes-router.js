const axios = require('axios')
const router = require('express').Router()

router.get('/', (req, res) => {
  const request = {
    headers: { accept: 'application/json' },
  }

  axios
    .get('https://api.fungenerators.com/taunt/generate?category=pirate-insult&api_key=xrMLQe6AhAqMEcYPlgHh6QeF', request)
    .then(response => {
      res.status(200).json(response.data.results)
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err })
    })
})

module.exports = router
