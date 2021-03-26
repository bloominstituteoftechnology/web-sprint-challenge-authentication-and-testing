const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const db = require('../../data/dbConfig')
const makeToken = require('../middleware/token')



router.post('/register', (req, res) => {
  const user = req.body
  if(isValid(user)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;
    const hash = bcryptjs.hashSync(user.password, rounds )

    user.password = hash;

    return db('users').insert(user)
      .then(user => {
        res.status(201).json({data: user})
      })
      .catch(err => {
        res.status(500).json({message: err.message});
      })
  } else {
    res.status(400).json({message:"username taken" })
  }
  function isValid(user){
    return Boolean(user.username && user.password && typeof user.password === "string");
}

});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body
  
  if(isValid(req.body)) {
    await db('users').where( "username", username)
      .then(([user]) => {
        if(user && bcryptjs.compareSync( password, user.password)) {
          const token = makeToken(user)
          res.status(200).json({ message:"Welcome," + user.username, token })
        } else {
          res.status(401).json({ message: 'Invalid Credentials' })
        }
      })
      .catch( err => {
        res.status(500).json({ message: err.message})
      })   
  } else {
    res.status(400).json({
      message: "Username and password required"
    })
    
  }
  function isValid(user){
    return Boolean(user.username && user.password && typeof user.password === "string");
} 
 
});

module.exports = router;
