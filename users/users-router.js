let router = require('express').Router();

router.get('/', (req, res) => {
    res.status(200).json({ message: "Hello user" })
})

module.exports = router;